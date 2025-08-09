import { Card } from '@design-system/components/surfaces/card/Card';
import React, { FC } from 'react';
import { Image } from '../../../../core/elements/Image';
import { Testimonial } from '../../../../core/types/commonTypes';

export const TestimonialCard: FC<{
    testimonial: Testimonial;
}> = ({
    testimonial: {
        testimonial,
        photoPath,
        firstName,
        lastName,
        testimonialReference,
    },
}) => (
    <Card className="flex min-h-96 min-w-72 flex-[0_0_50%] flex-col justify-between gap-8 !p-6 md:!p-10">
        <div
            className="text-base text-slate-800"
            dangerouslySetInnerHTML={{
                __html: testimonial,
            }}
        />
        <div className="flex gap-6">
            <Image
                imageSrc={photoPath}
                alt={`${firstName} ${lastName}`}
                className="h-10 w-10 rounded-full"
            />
            <div>
                <div className="font-medium text-slate-800">
                    {firstName} {lastName}
                </div>
                <div className="mt-1 min-h-5 text-sm text-slate-500">
                    {testimonialReference}
                </div>
            </div>
        </div>
    </Card>
);
