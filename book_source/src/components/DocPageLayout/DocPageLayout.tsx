import React from 'react';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import './DocPageLayout.css';

interface DocPageLayoutProps {
  children: React.ReactNode;
}

const DocPageLayout: React.FC<DocPageLayoutProps> = ({ children }) => {
  return (
    <Layout wrapperClassName="doc-page-layout">
      <div className="doc-page-layout__content">
        {children}
      </div>
    </Layout>
  );
};

export default DocPageLayout;