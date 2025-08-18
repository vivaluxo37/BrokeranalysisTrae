import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

// Supabase configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

interface BrokerData {
  id: string;
  slug: string;
  name: string;
  avg_rating: number | null;
  logo_url: string | null;
  headquarters: string | null;
  status: string;
}

interface RegulationData {
  country_code: string;
  regulator_name: string;
  license_id: string | null;
}

// Fetch broker data from Supabase
async function fetchBrokerData(slug: string): Promise<{ broker: BrokerData | null; regulations: RegulationData[] }> {
  try {
    // Fetch broker basic data
    const brokerResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/brokers?slug=eq.${slug}&select=*`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!brokerResponse.ok) {
      throw new Error('Failed to fetch broker data');
    }

    const brokerData = await brokerResponse.json();
    const broker = brokerData[0] || null;

    if (!broker) {
      return { broker: null, regulations: [] };
    }

    // Fetch regulation data
    const regulationResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/broker_regulation?broker_id=eq.${broker.id}&select=*`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const regulations = regulationResponse.ok ? await regulationResponse.json() : [];

    return { broker, regulations };
  } catch (error) {
    console.error('Error fetching broker data:', error);
    return { broker: null, regulations: [] };
  }
}

// Generate star rating display
function generateStarRating(rating: number | null): string {
  if (!rating) return '☆☆☆☆☆';
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(emptyStars);
}

// Get regulation badges
function getRegulationBadges(regulations: RegulationData[]): string[] {
  const badges: string[] = [];
  
  regulations.forEach(reg => {
    if (reg.regulator_name) {
      // Common regulatory authorities
      if (reg.regulator_name.includes('FCA') || reg.country_code === 'GB') {
        badges.push('FCA Regulated');
      } else if (reg.regulator_name.includes('CySEC') || reg.country_code === 'CY') {
        badges.push('CySEC Regulated');
      } else if (reg.regulator_name.includes('ASIC') || reg.country_code === 'AU') {
        badges.push('ASIC Regulated');
      } else if (reg.regulator_name.includes('SEC') || reg.country_code === 'US') {
        badges.push('SEC Regulated');
      } else {
        badges.push(`${reg.regulator_name} Regulated`);
      }
    }
  });
  
  return badges.slice(0, 2); // Limit to 2 badges for space
}

export const runtime = 'edge';

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return new Response('Missing slug parameter', { status: 400 });
    }

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return new Response('Supabase configuration missing', { status: 500 });
    }

    // Fetch broker data
    const { broker, regulations } = await fetchBrokerData(slug);

    if (!broker) {
      return new Response('Broker not found', { status: 404 });
    }

    const rating = broker.avg_rating || 0;
    const starRating = generateStarRating(rating);
    const badges = getRegulationBadges(regulations);

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1a1a2e',
            backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            position: 'relative',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%)',
            }}
          />
          
          {/* Main Content Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '24px',
              padding: '60px 80px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              maxWidth: '1000px',
              width: '90%',
            }}
          >
            {/* Logo Section */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '60px',
              }}
            >
              {broker.logo_url ? (
                <img
                  src={broker.logo_url}
                  alt={`${broker.name} logo`}
                  style={{
                    width: '120px',
                    height: '120px',
                    objectFit: 'contain',
                    borderRadius: '16px',
                    border: '3px solid #e5e7eb',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '120px',
                    height: '120px',
                    backgroundColor: '#3b82f6',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  {broker.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                flex: 1,
              }}
            >
              {/* Broker Name */}
              <h1
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: '0 0 16px 0',
                  lineHeight: '1.1',
                }}
              >
                {broker.name}
              </h1>

              {/* Rating */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                <span
                  style={{
                    fontSize: '32px',
                    color: '#fbbf24',
                    marginRight: '12px',
                  }}
                >
                  {starRating}
                </span>
                <span
                  style={{
                    fontSize: '28px',
                    fontWeight: '600',
                    color: '#374151',
                  }}
                >
                  {rating.toFixed(1)}/5
                </span>
              </div>

              {/* Regulation Badges */}
              {badges.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  {badges.map((badge, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '18px',
                        fontWeight: '600',
                      }}
                    >
                      ✓ {badge}
                    </div>
                  ))}
                </div>
              )}

              {/* Headquarters */}
              {broker.headquarters && (
                <div
                  style={{
                    marginTop: '16px',
                    fontSize: '20px',
                    color: '#6b7280',
                  }}
                >
                  📍 {broker.headquarters}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              right: '40px',
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: '500',
            }}
          >
            BrokerAnalysis.com
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Error generating image', { status: 500 });
  }
}