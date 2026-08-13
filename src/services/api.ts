import { Project, LeadFormData } from '../types';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwe2A2tkjeqpwt6pqYRzdKfR2B6jdebprKqN0oSe_XQ8PaoWRc9XCqSEAucx-im1vGEoQ/exec';

/**
 * Normalizes raw project records from Google Sheets / Apps Script
 * so property keys match our standard Project interface regardless of space vs underscore
 */
export function normalizeProject(raw: Record<string, any>): Project {
  return {
    ID: String(raw.ID || raw.id || ''),
    AREA: String(raw.AREA || raw.area || raw['Area'] || ''),
    PROJECT_NAME: String(raw.PROJECT_NAME || raw.project_name || raw['PROJECT NAME'] || raw['Project Name'] || ''),
    PRICE_FROM: String(raw.PRICE_FROM || raw.price_from || raw['PRICE FROM'] || raw['Price From'] || ''),
    PROPERTY_TYPE: String(raw.PROPERTY_TYPE || raw.property_type || raw['PROPERTY TYPE'] || raw['Property Type'] || ''),
    BUILT_UP: String(raw.BUILT_UP || raw.built_up || raw['BUILT UP'] || raw['Built Up'] || ''),
    LAND_SIZE: String(raw.LAND_SIZE || raw.land_size || raw['LAND SIZE'] || raw['Land Size'] || ''),
    BEDROOMS: String(raw.BEDROOMS || raw.bedrooms || raw['Bedrooms'] || ''),
    BATHROOMS: String(raw.BATHROOMS || raw.bathrooms || raw['Bathrooms'] || ''),
    TENURE: String(raw.TENURE || raw.tenure || raw['Tenure'] || ''),
    STATUS: String(raw.STATUS || raw.status || raw['Status'] || ''),
    MAIN_IMAGE: String(raw.MAIN_IMAGE || raw.main_image || raw['MAIN IMAGE'] || raw['Main Image'] || ''),
    GALLERY_URLS: String(raw.GALLERY_URLS || raw.gallery_urls || raw['GALLERY URLS'] || raw['Gallery Urls'] || ''),
    GOOGLE_MAPS_URL: String(raw.GOOGLE_MAPS_URL || raw.google_maps_url || raw['GOOGLE MAPS URL'] || raw['Google Maps Url'] || ''),
    DESCRIPTION: String(raw.DESCRIPTION || raw.description || raw['Description'] || ''),
    KEY_FEATURES: String(raw.KEY_FEATURES || raw.key_features || raw['KEY FEATURES'] || raw['Key Features'] || ''),
    FACILITIES: String(raw.FACILITIES || raw.facilities || raw['Facilities'] || ''),
    SALES_PACKAGE: String(raw.SALES_PACKAGE || raw.sales_package || raw['SALES PACKAGE'] || raw['Sales Package'] || ''),
    COMPLETION: String(raw.COMPLETION || raw.completion || raw['Completion'] || ''),
    SORT_ORDER: String(raw.SORT_ORDER || raw.sort_order || raw['SORT ORDER'] || ''),
    LAST_UPDATED: String(raw.LAST_UPDATED || raw.last_updated || raw['LAST UPDATED'] || ''),
  };
}

/**
 * Fetch projects from API (Express route or direct Google Apps Script fallback)
 */
export async function fetchProjects(): Promise<Project[]> {
  try {
    // Try Express backend route first
    const response = await fetch('/api/projects');
    if (response.ok) {
      const data = await response.json();
      if (data.success && Array.isArray(data.projects)) {
        return data.projects.map(normalizeProject);
      }
    }
  } catch (err) {
    console.warn('Express route failed, attempting direct fetch:', err);
  }

  // Fallback to direct fetch
  try {
    const directRes = await fetch(`${APPS_SCRIPT_URL}?action=projects`);
    if (directRes.ok) {
      const data = await directRes.json();
      if (data.success && Array.isArray(data.projects)) {
        return data.projects.map(normalizeProject);
      }
    }
  } catch (err) {
    console.error('Direct fetch failed:', err);
  }

  return [];
}

/**
 * Submit lead form to Google Apps Script API
 */
export async function submitLead(formData: LeadFormData): Promise<{ success: boolean; message?: string }> {
  const payload = {
    leadType: formData.leadType,
    name: formData.name,
    phone: formData.phone,
    email: formData.email,
    preferredArea: formData.preferredArea,
    interestedProject: formData.interestedProject,
    grossIncome: formData.grossIncome,
    netIncome: formData.netIncome,
    employmentStatus: formData.employmentStatus,
    loanCommitments: formData.loanCommitments,
    firstHomeBuyer: formData.firstHomeBuyer,
    propertyType: formData.propertyType,
    estimatedBudget: formData.estimatedBudget,
    remarks: formData.remarks,
    consent: formData.consent,
    source: formData.source || 'Klang Valley Homes Website',
  };

  try {
    // Attempt via Express proxy first
    const response = await fetch('/api/lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const resData = await response.json();
      return {
        success: resData.success ?? true,
        message: resData.message || 'Berjaya dihantar',
      };
    }
  } catch (err) {
    console.warn('Express lead submit failed, trying direct post:', err);
  }

  // Fallback to direct fetch using text/plain (avoids CORS preflight blocking in Apps Script)
  try {
    const directRes = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (directRes.ok) {
      const text = await directRes.text();
      try {
        const json = JSON.parse(text);
        return {
          success: json.success ?? true,
          message: json.message || 'Berjaya dihantar',
        };
      } catch {
        // Many Apps Script POSTs return text HTML or JSON string
        return { success: true };
      }
    }
  } catch (err) {
    console.error('Direct lead submission error:', err);
  }

  throw new Error('Gagal menghantar permohonan ke pelayan.');
}
