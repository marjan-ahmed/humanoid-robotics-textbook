
const ghpages = require('gh-pages');
const path = require('path');

console.log('Starting deployment...');

ghpages.publish(path.join(__dirname, 'build'), {
  branch: 'gh-pages',
  dest: '002-chatbot-ui',
}, function(err) {
  if (err) {
    console.error('Deployment failed!', err);
  } else {
    console.log('Deployment successful!');
  }
});
