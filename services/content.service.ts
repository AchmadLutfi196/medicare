// Content service for managing hospital information, articles, FAQs, etc.
import { where, orderBy, QueryConstraint } from 'firebase/firestore';
import { dbService } from './database.service';
import { Article, FAQ, HospitalInfo, Facility, Management, EmergencyContact, ApiResponse } from '../types/database';

export class ContentService {
  private static instance: ContentService;

  static getInstance(): ContentService {
    if (!ContentService.instance) {
      ContentService.instance = new ContentService();
    }
    return ContentService.instance;
  }

  // Hospital Info Management
  async getHospitalInfo(): Promise<ApiResponse<HospitalInfo>> {
    const result = await dbService.getAll<HospitalInfo>('hospital_info');
    if (result.success && result.data && result.data.length > 0) {
      return {
        success: true,
        data: result.data[0]
      };
    }
    return {
      success: false,
      error: 'Hospital information not found'
    };
  }

  async updateHospitalInfo(data: Partial<HospitalInfo>): Promise<ApiResponse<void>> {
    const currentInfo = await this.getHospitalInfo();
    if (currentInfo.success && currentInfo.data) {
      return await dbService.update<HospitalInfo>('hospital_info', currentInfo.data.id, data);
    } else {
      // Create new if doesn't exist
      const newInfo = await dbService.create<HospitalInfo>('hospital_info', data as Omit<HospitalInfo, 'id' | 'createdAt' | 'updatedAt'>);
      return {
        success: newInfo.success,
        error: newInfo.error,
        message: newInfo.success ? 'Hospital info created successfully' : undefined
      };
    }
  }

  // Article Management
  async createArticle(articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>): Promise<ApiResponse<Article & { id: string }>> {
    const article = {
      ...articleData,
      views: 0,
      likes: 0,
      slug: this.generateSlug(articleData.title)
    };
    return await dbService.create<Article>('articles', article);
  }

  async getArticleById(id: string): Promise<ApiResponse<Article>> {
    const result = await dbService.getById<Article>('articles', id);
    if (result.success && result.data) {
      // Increment view count
      await this.incrementArticleViews(id);
    }
    return result;
  }

  async getArticleBySlug(slug: string): Promise<ApiResponse<Article>> {
    const constraints: QueryConstraint[] = [where('slug', '==', slug)];
    const result = await dbService.getAll<Article>('articles', constraints);
    
    if (result.success && result.data && result.data.length > 0) {
      const article = result.data[0];
      // Increment view count
      await this.incrementArticleViews(article.id);
      return {
        success: true,
        data: article
      };
    }
    
    return {
      success: false,
      error: 'Article not found'
    };
  }

  async updateArticle(id: string, articleData: Partial<Article>): Promise<ApiResponse<void>> {
    if (articleData.title) {
      articleData.slug = this.generateSlug(articleData.title);
    }
    return await dbService.update<Article>('articles', id, articleData);
  }

  async deleteArticle(id: string): Promise<ApiResponse<void>> {
    return await dbService.delete('articles', id);
  }

  async getAllArticles(category?: string, published?: boolean): Promise<ApiResponse<Article[]>> {
    const constraints: QueryConstraint[] = [];
    
    if (category) {
      constraints.push(where('category', '==', category));
    }
    if (published !== undefined) {
      constraints.push(where('isPublished', '==', published));
    }
    
    constraints.push(orderBy('publishedAt', 'desc'));
    
    return await dbService.getAll<Article>('articles', constraints);
  }

  async getPublishedArticles(category?: string): Promise<ApiResponse<Article[]>> {
    return await this.getAllArticles(category, true);
  }

  async getFeaturedArticles(limit: number = 6): Promise<ApiResponse<Article[]>> {
    const constraints: QueryConstraint[] = [
      where('isPublished', '==', true),
      orderBy('views', 'desc'),
      orderBy('publishedAt', 'desc')
    ];
    
    const result = await dbService.getAll<Article>('articles', constraints);
    if (result.success && result.data) {
      result.data = result.data.slice(0, limit);
    }
    
    return result;
  }

  async searchArticles(searchTerm: string): Promise<ApiResponse<Article[]>> {
    const allArticles = await this.getPublishedArticles();
    
    if (allArticles.success && allArticles.data) {
      const filtered = allArticles.data.filter(article => {
        const search = searchTerm.toLowerCase();
        return article.title.toLowerCase().includes(search) ||
               article.excerpt.toLowerCase().includes(search) ||
               article.content.toLowerCase().includes(search) ||
               article.tags.some(tag => tag.toLowerCase().includes(search));
      });
      
      return {
        success: true,
        data: filtered
      };
    }
    
    return allArticles;
  }

  async incrementArticleViews(id: string): Promise<void> {
    const article = await dbService.getById<Article>('articles', id);
    if (article.success && article.data) {
      await dbService.update<Article>('articles', id, { 
        views: article.data.views + 1 
      });
    }
  }

  async incrementArticleLikes(id: string): Promise<ApiResponse<void>> {
    const article = await dbService.getById<Article>('articles', id);
    if (article.success && article.data) {
      return await dbService.update<Article>('articles', id, { 
        likes: article.data.likes + 1 
      });
    }
    return {
      success: false,
      error: 'Article not found'
    };
  }

  async publishArticle(id: string): Promise<ApiResponse<void>> {
    return await this.updateArticle(id, { 
      isPublished: true, 
      publishedAt: new Date() 
    });
  }

  async unpublishArticle(id: string): Promise<ApiResponse<void>> {
    return await this.updateArticle(id, { isPublished: false });
  }

  // FAQ Management
  async createFAQ(faqData: Omit<FAQ, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'helpful' | 'notHelpful'>): Promise<ApiResponse<FAQ & { id: string }>> {
    const faq = {
      ...faqData,
      views: 0,
      helpful: 0,
      notHelpful: 0
    };
    return await dbService.create<FAQ>('faqs', faq);
  }

  async getFAQById(id: string): Promise<ApiResponse<FAQ>> {
    const result = await dbService.getById<FAQ>('faqs', id);
    if (result.success && result.data) {
      // Increment view count
      await this.incrementFAQViews(id);
    }
    return result;
  }

  async updateFAQ(id: string, faqData: Partial<FAQ>): Promise<ApiResponse<void>> {
    return await dbService.update<FAQ>('faqs', id, faqData);
  }

  async deleteFAQ(id: string): Promise<ApiResponse<void>> {
    return await dbService.delete('faqs', id);
  }

  async getAllFAQs(category?: string, published?: boolean): Promise<ApiResponse<FAQ[]>> {
    const constraints: QueryConstraint[] = [];
    
    if (category) {
      constraints.push(where('category', '==', category));
    }
    if (published !== undefined) {
      constraints.push(where('isPublished', '==', published));
    }
    
    constraints.push(orderBy('order', 'asc'));
    constraints.push(orderBy('createdAt', 'desc'));
    
    return await dbService.getAll<FAQ>('faqs', constraints);
  }

  async getPublishedFAQs(category?: string): Promise<ApiResponse<FAQ[]>> {
    return await this.getAllFAQs(category, true);
  }

  async incrementFAQViews(id: string): Promise<void> {
    const faq = await dbService.getById<FAQ>('faqs', id);
    if (faq.success && faq.data) {
      await dbService.update<FAQ>('faqs', id, { 
        views: faq.data.views + 1 
      });
    }
  }

  async markFAQHelpful(id: string, isHelpful: boolean): Promise<ApiResponse<void>> {
    const faq = await dbService.getById<FAQ>('faqs', id);
    if (faq.success && faq.data) {
      const updateData = isHelpful 
        ? { helpful: faq.data.helpful + 1 }
        : { notHelpful: faq.data.notHelpful + 1 };
      
      return await dbService.update<FAQ>('faqs', id, updateData);
    }
    return {
      success: false,
      error: 'FAQ not found'
    };
  }

  // Facility Management
  async createFacility(facilityData: Omit<Facility, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Facility & { id: string }>> {
    return await dbService.create<Facility>('facilities', facilityData);
  }

  async getFacilityById(id: string): Promise<ApiResponse<Facility>> {
    return await dbService.getById<Facility>('facilities', id);
  }

  async updateFacility(id: string, facilityData: Partial<Facility>): Promise<ApiResponse<void>> {
    return await dbService.update<Facility>('facilities', id, facilityData);
  }

  async deleteFacility(id: string): Promise<ApiResponse<void>> {
    return await dbService.delete('facilities', id);
  }

  async getAllFacilities(category?: string, active?: boolean): Promise<ApiResponse<Facility[]>> {
    const constraints: QueryConstraint[] = [];
    
    if (category) {
      constraints.push(where('category', '==', category));
    }
    if (active !== undefined) {
      constraints.push(where('isActive', '==', active));
    }
    
    constraints.push(orderBy('order', 'asc'));
    constraints.push(orderBy('name', 'asc'));
    
    return await dbService.getAll<Facility>('facilities', constraints);
  }

  async getActiveFacilities(category?: string): Promise<ApiResponse<Facility[]>> {
    return await this.getAllFacilities(category, true);
  }

  // Management Team
  async createManagement(managementData: Omit<Management, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Management & { id: string }>> {
    return await dbService.create<Management>('management', managementData);
  }

  async getManagementById(id: string): Promise<ApiResponse<Management>> {
    return await dbService.getById<Management>('management', id);
  }

  async updateManagement(id: string, managementData: Partial<Management>): Promise<ApiResponse<void>> {
    return await dbService.update<Management>('management', id, managementData);
  }

  async deleteManagement(id: string): Promise<ApiResponse<void>> {
    return await dbService.delete('management', id);
  }

  async getAllManagement(department?: string, active?: boolean): Promise<ApiResponse<Management[]>> {
    const constraints: QueryConstraint[] = [];
    
    if (department) {
      constraints.push(where('department', '==', department));
    }
    if (active !== undefined) {
      constraints.push(where('isActive', '==', active));
    }
    
    constraints.push(orderBy('order', 'asc'));
    constraints.push(orderBy('name', 'asc'));
    
    return await dbService.getAll<Management>('management', constraints);
  }

  async getActiveManagement(department?: string): Promise<ApiResponse<Management[]>> {
    return await this.getAllManagement(department, true);
  }

  // Emergency Contacts
  async createEmergencyContact(contactData: Omit<EmergencyContact, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<EmergencyContact & { id: string }>> {
    return await dbService.create<EmergencyContact>('emergency_contacts', contactData);
  }

  async getEmergencyContactById(id: string): Promise<ApiResponse<EmergencyContact>> {
    return await dbService.getById<EmergencyContact>('emergency_contacts', id);
  }

  async updateEmergencyContact(id: string, contactData: Partial<EmergencyContact>): Promise<ApiResponse<void>> {
    return await dbService.update<EmergencyContact>('emergency_contacts', id, contactData);
  }

  async deleteEmergencyContact(id: string): Promise<ApiResponse<void>> {
    return await dbService.delete('emergency_contacts', id);
  }

  async getAllEmergencyContacts(active?: boolean): Promise<ApiResponse<EmergencyContact[]>> {
    const constraints: QueryConstraint[] = [];
    
    if (active !== undefined) {
      constraints.push(where('isActive', '==', active));
    }
    
    constraints.push(orderBy('priority', 'asc'));
    constraints.push(orderBy('name', 'asc'));
    
    return await dbService.getAll<EmergencyContact>('emergency_contacts', constraints);
  }

  async getActiveEmergencyContacts(): Promise<ApiResponse<EmergencyContact[]>> {
    return await this.getAllEmergencyContacts(true);
  }

  // Utility methods
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, ''); // Remove leading and trailing dashes
  }

  // Get categories for various content types
  async getArticleCategories(): Promise<ApiResponse<string[]>> {
    const articles = await this.getPublishedArticles();
    if (articles.success && articles.data) {
      const categories = [...new Set(articles.data.map(a => a.category))];
      return {
        success: true,
        data: categories.sort()
      };
    }
    return {
      success: false,
      error: articles.error || 'Failed to get categories'
    };
  }

  async getFAQCategories(): Promise<ApiResponse<string[]>> {
    const faqs = await this.getPublishedFAQs();
    if (faqs.success && faqs.data) {
      const categories = [...new Set(faqs.data.map(f => f.category))];
      return {
        success: true,
        data: categories.sort()
      };
    }
    return {
      success: false,
      error: faqs.error || 'Failed to get categories'
    };
  }

  async getFacilityCategories(): Promise<ApiResponse<string[]>> {
    const facilities = await this.getActiveFacilities();
    if (facilities.success && facilities.data) {
      const categories = [...new Set(facilities.data.map(f => f.category))];
      return {
        success: true,
        data: categories.sort()
      };
    }
    return {
      success: false,
      error: facilities.error || 'Failed to get categories'
    };
  }
}

export const contentService = ContentService.getInstance();
