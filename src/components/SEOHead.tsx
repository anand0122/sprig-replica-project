import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  structuredData?: object;
  noIndex?: boolean;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = "FormPulse - AI-Powered Form Builder | Create Smart Forms & Surveys in Minutes",
  description = "Build beautiful, high-converting forms and surveys with AI in seconds. Advanced analytics, 40+ integrations, GDPR compliant. Start free - no coding required!",
  keywords = "form builder, AI forms, survey creator, online forms, form analytics, quiz builder, data collection, lead generation, customer feedback, form templates, drag drop forms, conditional logic, form integrations, GDPR forms, responsive forms",
  image = "https://formpulse.com/og-image.png",
  url = "https://formpulse.com/",
  type = "website",
  structuredData,
  noIndex = false
}) => {
  useEffect(() => {
    document.title = title;

    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow');
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:title', title, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', image, true);

    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"][data-dynamic]');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('data-dynamic', 'true');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }
  }, [title, description, keywords, image, url, type, structuredData, noIndex]);

  return null;
};

// Predefined structured data for common pages
export const getPageStructuredData = (pageType: string, data?: any) => {
  const baseUrl = 'https://formpulse.com';
  
  switch (pageType) {
    case 'homepage':
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "FormPulse",
        "url": baseUrl,
        "logo": `${baseUrl}/logo.png`,
        "description": "AI-powered form builder for creating beautiful, high-converting forms and surveys",
        "foundingDate": "2024",
        "sameAs": [
          "https://twitter.com/FormPulse",
          "https://linkedin.com/company/formpulse"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "email": "support@formpulse.com"
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "description": "Free plan available"
        }
      };

    case 'pricing':
      return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "FormPulse",
        "description": "AI-powered form builder with advanced analytics and integrations",
        "brand": {
          "@type": "Brand",
          "name": "FormPulse"
        },
        "offers": [
          {
            "@type": "Offer",
            "name": "Free Plan",
            "price": "0",
            "priceCurrency": "USD",
            "description": "Basic form building with AI assistance"
          },
          {
            "@type": "Offer",
            "name": "Pro Plan",
            "price": "29",
            "priceCurrency": "USD",
            "description": "Advanced features and analytics"
          },
          {
            "@type": "Offer",
            "name": "Enterprise Plan",
            "price": "99",
            "priceCurrency": "USD",
            "description": "Full feature access with priority support"
          }
        ]
      };

    case 'features':
      return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "FormPulse",
        "description": "AI-powered form builder with advanced features",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "featureList": [
          "AI-powered form generation",
          "Drag-and-drop form builder",
          "Advanced analytics and reporting",
          "40+ integrations",
          "GDPR compliance",
          "Real-time collaboration",
          "Conditional logic",
          "Custom branding",
          "Mobile responsive forms",
          "Quiz and survey tools"
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "1247",
          "bestRating": "5",
          "worstRating": "1"
        }
      };

    case 'blog-post':
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": data?.title || "FormPulse Blog Post",
        "description": data?.description || "Learn about form building best practices",
        "author": {
          "@type": "Organization",
          "name": "FormPulse"
        },
        "publisher": {
          "@type": "Organization",
          "name": "FormPulse",
          "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/logo.png`
          }
        },
        "datePublished": data?.publishDate || new Date().toISOString(),
        "dateModified": data?.modifiedDate || new Date().toISOString(),
        "image": data?.image || `${baseUrl}/blog-default.png`,
        "url": data?.url || baseUrl
      };

    default:
      return null;
  }
};

// SEO utility functions
export const generateKeywords = (baseKeywords: string[], additionalKeywords: string[] = []) => {
  const allKeywords = [...baseKeywords, ...additionalKeywords];
  return allKeywords.join(', ');
};

export const truncateDescription = (description: string, maxLength = 160) => {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength - 3) + '...';
};

export const generateSEOTitle = (pageTitle: string, siteName = 'FormPulse') => {
  if (pageTitle.includes(siteName)) return pageTitle;
  return `${pageTitle} | ${siteName}`;
}; 