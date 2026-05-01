
import Navbar from '../../components/Navbar'
import Banner from "../../components/Banner";
import WhyDonate from "../../components/WhyDonate";
import StatsCounter from "../../components/StatsCounter";
import AboutSection from "../../components/AboutSection";
import ScrollingTicker from "../../components/ScrollingTicker";
import Footer from "../../components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
       <Navbar  />
      <Banner></Banner>
        <ScrollingTicker></ScrollingTicker>
        <WhyDonate></WhyDonate>
        <AboutSection></AboutSection>
        <StatsCounter></StatsCounter>
         <Footer />
    </div>
  );
};

export default Home;
 
       