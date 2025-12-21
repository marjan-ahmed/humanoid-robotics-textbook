import React from 'react';
import Head from '@docusaurus/Head';
import OriginalLayout from '@theme-original/Layout';
import ChatPopup from '../components/chat-popup';

export default function Layout(props) {
  return (
    <div className="layout-wrapper">
      <Head>
        <script src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js" defer></script>
      </Head>
      <OriginalLayout {...props}>
        {props.children}
        <ChatPopup />
      </OriginalLayout>
    </div>
  );
}