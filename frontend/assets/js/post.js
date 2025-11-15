/**
 * Blog Post Page Logic
 * Handles rendering of individual blog posts
 */

document.addEventListener('DOMContentLoaded', () => {
  // Get DOM elements
  const titleEl = document.getElementById('post-title');
  const tagEl = document.getElementById('post-tag');
  const dateEl = document.getElementById('post-date');
  const imageEl = document.getElementById('post-image');
  const contentEl = document.getElementById('post-content');
  const backLink = document.querySelector('.back-to-blog');
  
  // Get post ID from URL
  const params = new URLSearchParams(window.location.search);
  const postId = params.get('id');

  // Check if blogPosts is available
  if (typeof blogPosts === 'undefined') {
    showError('Blog data could not be loaded. Please try again later.');
    return;
  }

  // Find the requested post
  const post = blogPosts.find(p => p.id === postId);

  // If post not found, show error
  if (!post) {
    showError('The requested blog post could not be found.');
    return;
  }

  // Update the page with post data
  renderPost(post);
  
  // Set up back button
  if (backLink) {
    backLink.href = document.referrer.includes('blog.html') ? 'blog.html' : 'home.html';
  }

  /**
   * Renders the blog post content
   * @param {Object} post - The blog post data
   */
  function renderPost(post) {
    // Update page title
    document.title = `${post.title} | MedConnect Blog`;
    
    // Update post elements
    if (titleEl) titleEl.textContent = post.title;
    if (tagEl) {
      tagEl.textContent = post.tag;
      tagEl.style.backgroundColor = getTagColor(post.tag);
    }
    if (dateEl) {
      dateEl.textContent = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    if (imageEl) {
      imageEl.src = post.imageUrl;
      imageEl.alt = post.title;
      imageEl.style.display = 'block';
    }
    if (contentEl) {
      contentEl.innerHTML = post.fullContent || '<p>No content available for this post.</p>';
    }
    
    // Add some styling to the content
    styleContent();
  }
  
  /**
   * Returns a color based on the tag name
   * @param {string} tag - The tag name
   * @returns {string} - The color code
   */
  function getTagColor(tag) {
    const colors = {
      'Wellness': '#e3f2fd',
      'Nutrition': '#e8f5e9',
      'Safety': '#fff3e0',
      'Default': '#f5f5f5'
    };
    return colors[tag] || colors['Default'];
  }
  
  /**
   * Applies additional styling to the post content
   */
  function styleContent() {
    // Add styling to all paragraphs
    const paragraphs = contentEl.querySelectorAll('p');
    paragraphs.forEach(p => {
      p.style.marginBottom = '1.5rem';
      p.style.lineHeight = '1.7';
    });
    
    // Style images within content
    const images = contentEl.querySelectorAll('img');
    images.forEach(img => {
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.borderRadius = '8px';
      img.style.margin = '1.5rem 0';
    });
    
    // Style headings
    const headings = contentEl.querySelectorAll('h2, h3, h4');
    headings.forEach((heading, index) => {
      heading.style.marginTop = index === 0 ? '1.5rem' : '2.5rem';
      heading.style.marginBottom = '1rem';
      heading.style.color = 'var(--text-primary)';
    });
  }
  
  /**
   * Displays an error message
   * @param {string} message - The error message to display
   */
  function showError(message) {
    if (contentEl) {
      contentEl.innerHTML = `
        <div class="error-message" style="
          text-align: center;
          padding: 2rem;
          background: #ffebee;
          border-radius: 8px;
          margin: 2rem 0;
        ">
          <h3 style="color: #c62828; margin-bottom: 1rem;">Error Loading Post</h3>
          <p style="margin-bottom: 1.5rem;">${message}</p>
          <a href="blog.html" class="btn btn-primary">Back to Blog</a>
        </div>
      `;
    }
    
    if (titleEl) {
      titleEl.textContent = 'Post Not Found';
    }
  }
});
