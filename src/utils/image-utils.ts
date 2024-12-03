
const profileImages = [
    '/profile-images/R.jpg',
    '/profile-images/rpage.jpg',
    '/profile-images/R (1).jpg',
    '/profile-images/happy.jpg',
    '/profile-images/foto343.jpg',
    '/profile-images/foto112.jpg',
    '/profile-images/foto11.jpg'
  ];
  
  export function getRandomProfileImage(): string {
    const randomIndex = Math.floor(Math.random() * profileImages.length);
    return profileImages[randomIndex];
  }
  
  