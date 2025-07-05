// Custom hook for testimonials operations
import { useState, useEffect } from 'react';
import { Testimonial, TestimonialFilters, TestimonialFormData } from '../types/database';

interface UseTestimonialsReturn {
  testimonials: Testimonial[];
  loading: boolean;
  error: string | null;
  stats: {
    total: number;
    verified: number;
    public: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
    totalHelpfulVotes: number;
    treatmentTypes: { [key: string]: number };
  } | null;
  treatmentTypes: string[];
  refetch: () => void;
  createTestimonial: (data: TestimonialFormData & { patientName: string }) => Promise<boolean>;
  addHelpfulVote: (id: string) => Promise<boolean>;
}

export function useTestimonials(filters?: TestimonialFilters): UseTestimonialsReturn {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [treatmentTypes, setTreatmentTypes] = useState<string[]>([]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params
      const params = new URLSearchParams();
      params.append('endpoint', 'public');
      
      if (filters) {
        if (filters.doctorId) params.append('doctorId', filters.doctorId);
        if (filters.rating) params.append('rating', filters.rating.toString());
        if (filters.treatmentType) params.append('treatmentType', filters.treatmentType);
      }

      const response = await fetch(`/api/testimonials?${params}`);
      const result = await response.json();

      if (result.success) {
        setTestimonials(result.data || []);
      } else {
        setError(result.error || 'Failed to fetch testimonials');
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/testimonials?endpoint=stats');
      const result = await response.json();

      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error('Error fetching testimonial stats:', err);
    }
  };

  const fetchTreatmentTypes = async () => {
    try {
      const response = await fetch('/api/testimonials?endpoint=treatment-types');
      const result = await response.json();

      if (result.success) {
        setTreatmentTypes(result.data || []);
      }
    } catch (err) {
      console.error('Error fetching treatment types:', err);
    }
  };

  const createTestimonial = async (data: TestimonialFormData & { patientName: string }): Promise<boolean> => {
    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (result.success) {
        fetchTestimonials(); // Refresh testimonials
        return true;
      } else {
        setError(result.error || 'Failed to create testimonial');
        return false;
      }
    } catch (err) {
      console.error('Error creating testimonial:', err);
      setError('Failed to create testimonial');
      return false;
    }
  };

  const addHelpfulVote = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/testimonials?id=${id}&action=helpful`, {
        method: 'PUT',
      });

      const result = await response.json();
      
      if (result.success) {
        // Update local state to show immediate feedback
        setTestimonials(prev => prev.map(t => 
          t.id === id ? { ...t, helpfulVotes: t.helpfulVotes + 1 } : t
        ));
        return true;
      } else {
        setError(result.error || 'Failed to add helpful vote');
        return false;
      }
    } catch (err) {
      console.error('Error adding helpful vote:', err);
      setError('Failed to add helpful vote');
      return false;
    }
  };

  const refetch = () => {
    fetchTestimonials();
    fetchStats();
    fetchTreatmentTypes();
  };

  useEffect(() => {
    fetchTestimonials();
    fetchStats();
    fetchTreatmentTypes();
  }, [filters]);

  return {
    testimonials,
    loading,
    error,
    stats,
    treatmentTypes,
    refetch,
    createTestimonial,
    addHelpfulVote,
  };
}

export function useFeaturedTestimonials(limit: number = 6) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/testimonials?endpoint=featured&limit=${limit}`);
        const result = await response.json();

        if (result.success) {
          setTestimonials(result.data || []);
        } else {
          setError(result.error || 'Failed to fetch featured testimonials');
        }
      } catch (err) {
        console.error('Error fetching featured testimonials:', err);
        setError('Failed to fetch featured testimonials');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTestimonials();
  }, [limit]);

  return { testimonials, loading, error };
}
