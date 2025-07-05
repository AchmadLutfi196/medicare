// API route for content management (articles, FAQs, facilities, etc.)
import { NextRequest, NextResponse } from 'next/server';
import { contentService } from '../../../services/content.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    
    if (!type) {
      return NextResponse.json(
        { success: false, error: 'Content type is required' },
        { status: 400 }
      );
    }

    // Handle different content types
    switch (type) {
      case 'hospital-info':
        const hospitalInfo = await contentService.getHospitalInfo();
        return NextResponse.json(hospitalInfo);

      case 'articles':
        if (id) {
          const article = await contentService.getArticleById(id);
          return NextResponse.json(article);
        }
        
        const category = searchParams.get('category');
        const published = searchParams.get('published');
        const search = searchParams.get('search');
        const endpoint = searchParams.get('endpoint');
        
        if (endpoint === 'featured') {
          const limit = searchParams.get('limit');
          const result = await contentService.getFeaturedArticles(
            limit ? parseInt(limit) : 6
          );
          return NextResponse.json(result);
        }
        
        if (endpoint === 'categories') {
          const result = await contentService.getArticleCategories();
          return NextResponse.json(result);
        }
        
        if (search) {
          const result = await contentService.searchArticles(search);
          return NextResponse.json(result);
        }
        
        const articlesResult = await contentService.getAllArticles(
          category || undefined,
          published ? published === 'true' : undefined
        );
        return NextResponse.json(articlesResult);

      case 'faqs':
        if (id) {
          const faq = await contentService.getFAQById(id);
          return NextResponse.json(faq);
        }
        
        const faqCategory = searchParams.get('category');
        const faqPublished = searchParams.get('published');
        const faqEndpoint = searchParams.get('endpoint');
        
        if (faqEndpoint === 'categories') {
          const result = await contentService.getFAQCategories();
          return NextResponse.json(result);
        }
        
        const faqsResult = await contentService.getAllFAQs(
          faqCategory || undefined,
          faqPublished ? faqPublished === 'true' : undefined
        );
        return NextResponse.json(faqsResult);

      case 'facilities':
        if (id) {
          const facility = await contentService.getFacilityById(id);
          return NextResponse.json(facility);
        }
        
        const facilityCategory = searchParams.get('category');
        const active = searchParams.get('active');
        const facilityEndpoint = searchParams.get('endpoint');
        
        if (facilityEndpoint === 'categories') {
          const result = await contentService.getFacilityCategories();
          return NextResponse.json(result);
        }
        
        const facilitiesResult = await contentService.getAllFacilities(
          facilityCategory || undefined,
          active ? active === 'true' : undefined
        );
        return NextResponse.json(facilitiesResult);

      case 'management':
        if (id) {
          const management = await contentService.getManagementById(id);
          return NextResponse.json(management);
        }
        
        const department = searchParams.get('department');
        const managementActive = searchParams.get('active');
        
        const managementResult = await contentService.getAllManagement(
          department || undefined,
          managementActive ? managementActive === 'true' : undefined
        );
        return NextResponse.json(managementResult);

      case 'emergency-contacts':
        if (id) {
          const contact = await contentService.getEmergencyContactById(id);
          return NextResponse.json(contact);
        }
        
        const contactActive = searchParams.get('active');
        
        const contactsResult = await contentService.getAllEmergencyContacts(
          contactActive ? contactActive === 'true' : undefined
        );
        return NextResponse.json(contactsResult);

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid content type' },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    if (!type) {
      return NextResponse.json(
        { success: false, error: 'Content type is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    let result;

    switch (type) {
      case 'articles':
        result = await contentService.createArticle(body);
        break;
      case 'faqs':
        result = await contentService.createFAQ(body);
        break;
      case 'facilities':
        result = await contentService.createFacility(body);
        break;
      case 'management':
        result = await contentService.createManagement(body);
        break;
      case 'emergency-contacts':
        result = await contentService.createEmergencyContact(body);
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid content type' },
          { status: 400 }
        );
    }

    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    const action = searchParams.get('action');
    
    if (!type) {
      return NextResponse.json(
        { success: false, error: 'Content type is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    let result;

    if (type === 'hospital-info') {
      result = await contentService.updateHospitalInfo(body);
    } else if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required for updates' },
        { status: 400 }
      );
    } else {
      switch (type) {
        case 'articles':
          if (action === 'publish') {
            result = await contentService.publishArticle(id);
          } else if (action === 'unpublish') {
            result = await contentService.unpublishArticle(id);
          } else if (action === 'like') {
            result = await contentService.incrementArticleLikes(id);
          } else {
            result = await contentService.updateArticle(id, body);
          }
          break;
        case 'faqs':
          if (action === 'helpful') {
            result = await contentService.markFAQHelpful(id, body.isHelpful);
          } else {
            result = await contentService.updateFAQ(id, body);
          }
          break;
        case 'facilities':
          result = await contentService.updateFacility(id, body);
          break;
        case 'management':
          result = await contentService.updateManagement(id, body);
          break;
        case 'emergency-contacts':
          result = await contentService.updateEmergencyContact(id, body);
          break;
        default:
          return NextResponse.json(
            { success: false, error: 'Invalid content type' },
            { status: 400 }
          );
      }
    }

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    
    if (!type || !id) {
      return NextResponse.json(
        { success: false, error: 'Content type and ID are required' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'articles':
        result = await contentService.deleteArticle(id);
        break;
      case 'faqs':
        result = await contentService.deleteFAQ(id);
        break;
      case 'facilities':
        result = await contentService.deleteFacility(id);
        break;
      case 'management':
        result = await contentService.deleteManagement(id);
        break;
      case 'emergency-contacts':
        result = await contentService.deleteEmergencyContact(id);
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid content type' },
          { status: 400 }
        );
    }

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
