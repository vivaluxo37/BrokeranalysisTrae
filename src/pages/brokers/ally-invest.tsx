import React from 'react';
import { AllyInvestReviewPage } from '../../components/AllyInvestReviewPage';
import { useParams } from 'react-router-dom';

const AllyInvestReviewPageWrapper: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  return <AllyInvestReviewPage brokerId={slug || 'ally-invest'} />;
};

export default AllyInvestReviewPageWrapper;
