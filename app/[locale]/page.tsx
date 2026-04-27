import { Service } from "../types/service";
import { Article } from "../types/blog";
import { Project } from "../types/project";
import FetchData from "../helpers/FetchData";
import { HOME_ENDPOINTS } from "../constants/endpoints";
import Hero_section from "../components/website/home/HeroSection";
import AboutComponent from "../components/website/home/AboutComponent";
import ValueSection from "../components/website/home/ValueSection";
import ServicesSection from "../components/website/home/ServicesSection";
import ContactUS from "../components/website/home/ContanctUS";
import BlogSection from "../components/website/home/_blogSection/BlogSection";
import PortfolioSection from "../components/website/home/_portfolioSection/PortfolioSection";
import { Category } from "../types/global";

interface ApiResponse {
  services: Service[];
  categories: Category[];
  projects: Project[];
  articles: Article[];
}

export default async function Home() {
  const data = await FetchData<ApiResponse>(HOME_ENDPOINTS.LIST_PUBLISHED);
  if (!data || typeof data !== "object") return <div>Error</div>;
  const { services, categories, projects, articles } = data as ApiResponse;
  return (
    <>
      <Hero_section />
      <AboutComponent />
      <ValueSection />
      <ServicesSection services={services ?? []} />
      <PortfolioSection projects={projects} categories={categories} />
      <BlogSection articles={articles} />
      <ContactUS />
    </>
  );
}
