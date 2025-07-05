// Database service utilities for Firebase Firestore
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  DocumentSnapshot,
  QueryConstraint,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ApiResponse, PaginatedResponse } from '../types/database';

export class DatabaseService {
  private static instance: DatabaseService;

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // Generic CRUD operations
  async create<T>(collectionName: string, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<T & { id: string }>> {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      const newDoc = await getDoc(docRef);
      const newData = { id: docRef.id, ...newDoc.data() } as T & { id: string };

      return {
        success: true,
        data: newData,
        message: 'Document created successfully'
      };
    } catch (error) {
      console.error('Error creating document:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getById<T>(collectionName: string, id: string): Promise<ApiResponse<T>> {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as T;
        return {
          success: true,
          data
        };
      } else {
        return {
          success: false,
          error: 'Document not found'
        };
      }
    } catch (error) {
      console.error('Error getting document:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async update<T>(collectionName: string, id: string, data: Partial<T>): Promise<ApiResponse<void>> {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });

      return {
        success: true,
        message: 'Document updated successfully'
      };
    } catch (error) {
      console.error('Error updating document:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async delete(collectionName: string, id: string): Promise<ApiResponse<void>> {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);

      return {
        success: true,
        message: 'Document deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting document:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getAll<T>(
    collectionName: string, 
    constraints: QueryConstraint[] = []
  ): Promise<ApiResponse<T[]>> {
    try {
      const q = query(collection(db, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error getting documents:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getPaginated<T>(
    collectionName: string,
    pageSize: number = 10,
    lastDoc?: DocumentSnapshot,
    constraints: QueryConstraint[] = []
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    try {
      let q = query(
        collection(db, collectionName),
        ...constraints,
        limit(pageSize)
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];

      // Get total count (this is approximate for performance)
      const totalQuery = query(collection(db, collectionName), ...constraints.filter(c => c.type !== 'limit'));
      const totalSnapshot = await getDocs(totalQuery);
      const total = totalSnapshot.size;

      const result: PaginatedResponse<T> = {
        items,
        total,
        page: lastDoc ? 0 : 1, // This would need to be tracked properly
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize)
      };

      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('Error getting paginated documents:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async search<T>(
    collectionName: string,
    field: string,
    searchTerm: string,
    constraints: QueryConstraint[] = []
  ): Promise<ApiResponse<T[]>> {
    try {
      // For simple text search, we'll use startAt/endAt
      const q = query(
        collection(db, collectionName),
        where(field, '>=', searchTerm),
        where(field, '<=', searchTerm + '\uf8ff'),
        ...constraints
      );

      const querySnapshot = await getDocs(q);
      
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error searching documents:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Utility methods for Firestore
  createTimestamp(date?: Date): Timestamp {
    return date ? Timestamp.fromDate(date) : Timestamp.now();
  }

  timestampToDate(timestamp: any): Date {
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate();
    }
    return new Date(timestamp);
  }

  // Batch operations
  async batchCreate<T>(collectionName: string, dataArray: Omit<T, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<ApiResponse<string[]>> {
    try {
      const promises = dataArray.map(data => this.create<T>(collectionName, data));
      const results = await Promise.all(promises);
      
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      if (failed.length > 0) {
        return {
          success: false,
          error: `${failed.length} out of ${dataArray.length} documents failed to create`
        };
      }

      return {
        success: true,
        data: successful.map(r => r.data!.id),
        message: `Successfully created ${successful.length} documents`
      };
    } catch (error) {
      console.error('Error in batch create:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

export const dbService = DatabaseService.getInstance();
