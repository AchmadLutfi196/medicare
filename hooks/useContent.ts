// Custom hook for content management (FAQ, guides, articles, etc.)
import { useState, useEffect } from 'react';
import { FAQ, Guide, Article, HospitalInfo } from '../types/database';

interface UseContentReturn {
  faqs: FAQ[];
  guides: Guide[];
  articles: Article[];
  hospitalInfo: HospitalInfo | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useContent(): UseContentReturn {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [hospitalInfo, setHospitalInfo] = useState<HospitalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all content types in parallel
      const [faqsResponse, guidesResponse, articlesResponse, hospitalInfoResponse] = await Promise.all([
        fetch('/api/content?type=faq'),
        fetch('/api/content?type=guide'),
        fetch('/api/content?type=article'),
        fetch('/api/content?type=hospital-info')
      ]);

      const [faqsResult, guidesResult, articlesResult, hospitalInfoResult] = await Promise.all([
        faqsResponse.json(),
        guidesResponse.json(),
        articlesResponse.json(),
        hospitalInfoResponse.json()
      ]);

      if (faqsResult.success) {
        setFaqs(faqsResult.data || []);
      }

      if (guidesResult.success) {
        setGuides(guidesResult.data || []);
      }

      if (articlesResult.success) {
        setArticles(articlesResult.data || []);
      }

      if (hospitalInfoResult.success) {
        setHospitalInfo(hospitalInfoResult.data || null);
      }

    } catch (err) {
      console.error('Error fetching content:', err);
      setError('Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchContent();
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return {
    faqs,
    guides,
    articles,
    hospitalInfo,
    loading,
    error,
    refetch,
  };
}

export function useFAQs(category?: string) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.append('type', 'faq');
        if (category) params.append('category', category);

        const response = await fetch(`/api/content?${params}`);
        const result = await response.json();

        if (result.success) {
          setFaqs(result.data || []);
        } else {
          setError(result.error || 'Failed to fetch FAQs');
        }
      } catch (err) {
        console.error('Error fetching FAQs:', err);
        setError('Failed to fetch FAQs');
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, [category]);

  return { faqs, loading, error };
}

export function useGuides(type?: string) {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.append('type', 'guide');
        if (type) params.append('guideType', type);

        const response = await fetch(`/api/content?${params}`);
        const result = await response.json();

        if (result.success) {
          setGuides(result.data || []);
        } else {
          setError(result.error || 'Failed to fetch guides');
        }
      } catch (err) {
        console.error('Error fetching guides:', err);
        setError('Failed to fetch guides');
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, [type]);

  return { guides, loading, error };
}

export function useHospitalInfo() {
  const [hospitalInfo, setHospitalInfo] = useState<HospitalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHospitalInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/content?type=hospital-info');
        const result = await response.json();

        if (result.success) {
          setHospitalInfo(result.data || null);
        } else {
          setError(result.error || 'Failed to fetch hospital info');
        }
      } catch (err) {
        console.error('Error fetching hospital info:', err);
        setError('Failed to fetch hospital info');
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalInfo();
  }, []);

  return { hospitalInfo, loading, error };
}
