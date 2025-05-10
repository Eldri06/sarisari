/**
 * Main JavaScript file for SariSari Stories
 */


document.addEventListener('DOMContentLoaded', function() {
    // Story form submission
    const storyForm = document.querySelector('form[enctype="multipart/form-data"]');
    if (storyForm) {
        console.log('Story form found, initializing handlers');
        
        // Make sure TinyMCE initializes properly
        if (typeof tinymce !== 'undefined') {
            // Wait for TinyMCE to initialize completely
            const checkTinyMCE = setInterval(function() {
                if (tinymce.get('content')) {
                    console.log('TinyMCE editor initialized');
                    clearInterval(checkTinyMCE);
                    
                    // Add change listener to ensure content is saved to form
                    tinymce.get('content').on('change', function() {
                        console.log('TinyMCE content changed, syncing to form');
                        this.save();
                    });
                }
            }, 500);
        } else {
            console.error('TinyMCE not loaded');
        }
        
        // Handle form submission
        storyForm.addEventListener('submit', function(e) {
            console.log('Form submission started');
            
            // Make sure TinyMCE content is saved to textarea
            if (typeof tinymce !== 'undefined' && tinymce.get('content')) {
                console.log('Saving TinyMCE content to form');
                tinymce.get('content').save();
            }
            
            // Validate required fields
            const title = document.getElementById('title');
            const category = document.getElementById('category_id');
            const contentArea = document.getElementById('content');
            let hasErrors = false;
            
            if (!title || !title.value.trim()) {
                console.error('Title is empty');
                hasErrors = true;
                // Add error highlight
                title.classList.add('error-field');
            } else {
                title.classList.remove('error-field');
            }
            
            if (!category || !category.value) {
                console.error('Category not selected');
                hasErrors = true;
                // Add error highlight
                category.classList.add('error-field');
            } else {
                category.classList.remove('error-field');
            }
            
            // Check content from TinyMCE or textarea
            let contentValue = '';
            if (typeof tinymce !== 'undefined' && tinymce.get('content')) {
                contentValue = tinymce.get('content').getContent();
            } else if (contentArea) {
                contentValue = contentArea.value;
            }
            
            if (!contentValue.trim()) {
                console.error('Content is empty');
                hasErrors = true;
                // Can't directly style TinyMCE, but can add a message
                const contentError = document.createElement('div');
                contentError.className = 'alert error';
                contentError.textContent = 'Please enter some content for your story';
                
                // Remove any existing error message
                const existingError = document.querySelector('.content-error');
                if (existingError) existingError.remove();
                
                contentError.classList.add('content-error');
                const editorParent = document.querySelector('.tox-tinymce').parentNode;
                editorParent.insertBefore(contentError, document.querySelector('.tox-tinymce'));
            } else {
                // Remove any existing error message
                const existingError = document.querySelector('.content-error');
                if (existingError) existingError.remove();
            }
            
            if (hasErrors) {
                console.log('Form has validation errors, preventing submission');
                e.preventDefault();
                
                // Show error message at the top
                const formContainer = document.querySelector('.form-container');
                const errorMessage = document.createElement('div');
                errorMessage.className = 'alert error';
                errorMessage.textContent = 'Please fill in all required fields.';
                
                // Remove any existing general error message
                const existingGeneralError = document.querySelector('.general-error');
                if (existingGeneralError) existingGeneralError.remove();
                
                errorMessage.classList.add('general-error');
                formContainer.insertBefore(errorMessage, formContainer.firstChild);
                
                // Scroll to the top of the form
                formContainer.scrollIntoView({ behavior: 'smooth' });
                return false;
            }
            
            console.log('Form validation passed, allowing submission');
            return true;
        });
        
        // Add styles for error fields
        const style = document.createElement('style');
        style.textContent = `
            .error-field {
                border: 2px solid #ff5252 !important;
                background-color: #fff8f8 !important;
            }
            .content-error {
                color: #ff5252;
                margin-bottom: 10px;
            }
        `;
        document.head.appendChild(style);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // transparent header on scroll
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // User dropdown menu
    const userMenuTrigger = document.querySelector('.user-menu-trigger');
    if (userMenuTrigger) {
        userMenuTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = document.querySelector('.user-dropdown');
            dropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            const dropdown = document.querySelector('.user-dropdown');
            const trigger = document.querySelector('.user-menu-trigger');
            
            if (dropdown && !dropdown.contains(e.target) && !trigger.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }
    
    // Profile tabs functionality
    const profileTabs = document.querySelectorAll('.profile-tabs a');
    if (profileTabs.length > 0) {
        profileTabs.forEach(tab => {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all tabs and content
                document.querySelectorAll('.profile-tabs a').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
            
                this.classList.add('active');
                
                
                const tabId = this.getAttribute('href');
                document.querySelector(tabId).classList.add('active');
            });
        });
    }
    
    // File upload preview
    const fileInput = document.getElementById('featured_image');
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                const preview = document.getElementById('image-preview');
                
                reader.addEventListener('load', function() {
                    // Create preview
                    preview.innerHTML = `
                        <img src="${this.result}" alt="Image preview">
                        <span class="remove-image" title="Remove image"><i class="fas fa-times"></i></span>
                    `;
                    
                    // Add remove functionality
                    const removeButton = document.querySelector('.remove-image');
                    if (removeButton) {
                        removeButton.addEventListener('click', function() {
                            fileInput.value = '';
                            preview.innerHTML = '';
                        });
                    }
                });
                
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Like button functionality
    const likeButtons = document.querySelectorAll('.like-button');
    if (likeButtons.length > 0) {
        likeButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const storyId = this.getAttribute('data-story-id');
                const likeCount = this.querySelector('.like-count');
                
                // Send AJAX request to toggle like
                fetch('/like.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `story_id=${storyId}`
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Update like count and button state
                        likeCount.textContent = data.likes;
                        
                        if (data.liked) {
                            this.classList.add('liked');
                        } else {
                            this.classList.remove('liked');
                        }
                    } else {
                        // User not logged in or other error
                        if (data.message === 'login_required') {
                            window.location.href = '/login.php?redirect=' + encodeURIComponent(window.location.href);
                        } else {
                            alert('Error: ' + data.message);
                        }
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            });
        });
    }
    
    // Comment form submission
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const storyId = this.getAttribute('data-story-id');
            const content = document.getElementById('comment-content').value;
            const commentsList = document.getElementById('comments-list');
            
            if (!content.trim()) {
                alert('Please enter a comment');
                return;
            }
            
            // Send AJAX request to add comment
            fetch('comment.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `story_id=${storyId}&content=${encodeURIComponent(content)}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Add new comment to the list
                    const newComment = document.createElement('div');
                    newComment.className = 'comment';
                    newComment.innerHTML = data.html;
                    
                    commentsList.insertBefore(newComment, commentsList.firstChild);
                    
                    // Clear form
                    document.getElementById('comment-content').value = '';
                    
                    // Update comment count
                    const commentCount = document.querySelector('.comment-count');
                    if (commentCount) {
                        commentCount.textContent = parseInt(commentCount.textContent) + 1;
                    }
                } else {
                    // User not logged in or other error
                    if (data.message === 'login_required') {
                        window.location.href = 'login.php?redirect=' + encodeURIComponent(window.location.href);
                    } else {
                        alert('Error: ' + data.message);
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }
    
    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[name="email"]').value;
            
            if (!email.trim()) {
                alert('Please enter your email address');
                return;
            }
            
            // Send AJAX request to subscribe
            fetch('subscribe.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `email=${encodeURIComponent(email)}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Show success message
                    const confirmation = document.createElement('p');
                    confirmation.className = 'subscription-confirmation';
                    confirmation.textContent = 'Thank you for subscribing!';
                    
                    this.parentNode.insertBefore(confirmation, this.nextSibling);
                    
                    // Clear form
                    this.querySelector('input[name="email"]').value = '';
                    
                    // Remove message after a few seconds
                    setTimeout(() => {
                        confirmation.remove();
                    }, 5000);
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }
});
