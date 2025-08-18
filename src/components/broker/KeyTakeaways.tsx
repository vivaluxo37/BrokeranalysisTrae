import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const KeyTakeaways = ({ takeaways }) => {
  return (
    <section className="py-12 bg-professional-black">
      <div className="content-container">
        <Card className="professional-card mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-pure-white">
              Key Takeaways
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(takeaways || []).map((takeaway, index) => (
                <div className="bg-charcoal-grey p-4 rounded-lg flex items-center" key={index}>
                  <div className="w-12 h-12 bg-accent-blue rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <p className="text-light-grey text-sm">{takeaway}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};