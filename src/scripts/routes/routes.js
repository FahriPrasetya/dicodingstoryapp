import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import RegisterPage from '../pages/auth/register/register-page';
import LoginPage from '../pages/auth/login/login-page';
import AddStoryPage from '../pages/add-story/add-story-page.js';
import DetailStoryPage from '../pages/detail-story/detail-story-page.js';
import MapPage from '../pages/map/map-page.js';
import SavedStoriesPage from '../pages/saved-stories/saved-stories.js';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
  '/add-story': new AddStoryPage(),
  '/detail/:id': new DetailStoryPage(),
  '/map': new MapPage(),
  '/saved-stories': new SavedStoriesPage(),
};

export default routes;
