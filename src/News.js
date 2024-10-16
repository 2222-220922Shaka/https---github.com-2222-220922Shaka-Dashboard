import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Simple function to categorize articles based on keywords
const categorizeArticle = (article) => {
  const categories = {
    sport: ['sport', 'football', 'basketball', 'tennis', 'athletics'],
    crime: ['crime', 'murder', 'robbery', 'theft', 'assault', 'police'],
    politics: ['politics', 'election', 'government', 'policy', 'parliament'],
    entertainment: ['movie', 'music', 'celebrity', 'tv', 'concert', 'award'],
    technology: ['tech', 'technology', 'AI', 'computer', 'gadget', 'software'],
    health: ['health', 'medicine', 'disease', 'cancer', 'fitness', 'mental health'],
  };

  let category = 'General'; // Default category if no match is found

  // Check if the title or description contains any of the category keywords
  for (const [key, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => article.title.toLowerCase().includes(keyword) || article.description?.toLowerCase().includes(keyword))) {
      category = key;
      break;
    }
  }

  return category;
};

const News = ({ location }) => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6); // Number of initially visible articles
  const [activeCategory, setActiveCategory] = useState('All'); // State to track the selected category

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      const API_KEY = '83cbe549797b421ba827d017fd6a04be'; // Replace with your news API key
      const url = `https://newsapi.org/v2/everything?q=${location}&apiKey=${API_KEY}`;
      const result = await axios.get(url);
      setNewsData(result.data.articles);
      setLoading(false);
    };
    fetchNews();
  }, [location]);

  // Categorize all articles when fetched
  const categorizedNews = newsData.reduce((categories, article) => {
    const category = categorizeArticle(article);
    if (!categories[category]) categories[category] = [];
    categories[category].push(article);
    return categories;
  }, {});

  // Filter articles based on selected category
  const filteredNews = activeCategory === 'All' ? newsData : categorizedNews[activeCategory] || [];

  // Handler to load more news
  const loadMoreNews = () => {
    setVisibleCount((prevCount) => prevCount + 6); // Show 6 more articles each time
  };

  // Handler for category selection
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setVisibleCount(6); // Reset visible count when category changes
  };

  if (loading) {
    return <div>Loading news...</div>;
  }

  return (
    <div className="news-container">
      <h3>Latest News in {location}:</h3>

      {/* Category Buttons */}
      <div className="category-buttons" style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
        <button onClick={() => handleCategoryClick('All')} className={`category-btn ${activeCategory === 'All' ? 'active' : ''}`}>All</button>
        <button onClick={() => handleCategoryClick('sport')} className={`category-btn ${activeCategory === 'sport' ? 'active' : ''}`}>Sport</button>
        <button onClick={() => handleCategoryClick('crime')} className={`category-btn ${activeCategory === 'crime' ? 'active' : ''}`}>Crime</button>
        <button onClick={() => handleCategoryClick('politics')} className={`category-btn ${activeCategory === 'politics' ? 'active' : ''}`}>Politics</button>
        <button onClick={() => handleCategoryClick('entertainment')} className={`category-btn ${activeCategory === 'entertainment' ? 'active' : ''}`}>Entertainment</button>
        <button onClick={() => handleCategoryClick('technology')} className={`category-btn ${activeCategory === 'technology' ? 'active' : ''}`}>Technology</button>
        <button onClick={() => handleCategoryClick('health')} className={`category-btn ${activeCategory === 'health' ? 'active' : ''}`}>Health</button>
      </div>

      {/* News Articles */}
      {filteredNews.length > 0 ? (
        <>
          <div className="news-grid">
            {filteredNews.slice(0, visibleCount).map((article, index) => (
              <div key={index} className="news-item">
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={article.urlToImage || 'https://via.placeholder.com/150'}
                    alt={article.title}
                    className="news-image"
                  />
                </a>
                <div className="news-description">
                  <p>{article.description || 'No description available.'}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {visibleCount < filteredNews.length && (
            <div className="show-more-container">
              <button onClick={loadMoreNews} className="show-more-btn">
                Show More
              </button>
            </div>
          )}
        </>
      ) : (
        <p>No news found.</p>
      )}
    </div>
  );
};

export default News;
