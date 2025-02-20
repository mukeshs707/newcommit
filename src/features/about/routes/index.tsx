
import Layout from "../../../components/layout"
import Breadcrumb from '../../../components/breadcrumbs';
import { useEffect, useState } from "react";
import { getPages } from "../../privacyPolicy/api";
import MarkdownIt from "markdown-it";

const AboutUs = () => {
  const [aboutPage, setAboutPage] = useState<string>('');

  const mdParser = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  });

  useEffect(() => {
    getPages({ type: 4 }).then(res => {
      setAboutPage(res.data.data.content);
    });
    window.scrollTo(0, 0);
  }, [])

  return (
    <Layout>
      <meta name="description" content="Learn about Commbitz, a leader in eSIM solutions. Connecting travelers in over 190+ countries with reliable, affordable, and seamless digital roaming." />
      <title>About Commbitz | Simplifying Global Connectivity</title>
      <Breadcrumb />
      <div className="container">
        <h3 className="text-center mt-5 mb-3">About Us</h3>
        <div
          className="text-white mb-5"
          dangerouslySetInnerHTML={{
            __html: mdParser.render(aboutPage),
          }}
        />
      </div>
    </Layout>
  );
};

export default AboutUs;