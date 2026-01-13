// Filter button interactions and pagination
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const groupCards = document.querySelectorAll('.group-card');
    const scrollContainer = document.getElementById('groups-scroll-container');
    const paginationDots = document.querySelectorAll('.pagination-dot');
    
    // Section navigation
    const exploreSection = document.getElementById('explore-section');
    const discoverGroupsSection = document.getElementById('discover-groups-section');
    const discoverEventsSection = document.getElementById('discover-events-section');
    const exploreHeader = document.getElementById('explore-header');
    const discoverHeader = document.getElementById('discover-header');
    const eventsHeader = document.getElementById('events-header');
    const groupsCard = document.getElementById('groups-card');
    const eventsCard = document.getElementById('events-card');
    const backToExploreBtn = document.getElementById('back-to-explore');
    const backToExploreFromEventsBtn = document.getElementById('back-to-explore-from-events');
    const blueBoxContainer = document.getElementById('blue-box-container');
    const eventsBlueBoxContainer = document.getElementById('events-blue-box-container');
    
    // Navigate to Discover Groups
    if (groupsCard) {
        groupsCard.addEventListener('click', function() {
            exploreSection.classList.add('hidden');
            discoverGroupsSection.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Navigate back to Explore Quayside
    if (backToExploreBtn) {
        backToExploreBtn.addEventListener('click', function() {
            discoverGroupsSection.classList.add('hidden');
            exploreSection.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active state from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-primary', 'text-white', 'shadow-md', '-translate-y-1', 'border-transparent');
                btn.classList.add('bg-white', 'dark:bg-card-dark', 'text-gray-700', 'dark:text-gray-200', 'shadow-sm', 'border-gray-100', 'dark:border-gray-700');
            });
            
            // Add active state to clicked button
            this.classList.remove('bg-white', 'dark:bg-card-dark', 'text-gray-700', 'dark:text-gray-200', 'shadow-sm', 'border-gray-100', 'dark:border-gray-700');
            this.classList.add('bg-primary', 'text-white', 'shadow-md', '-translate-y-1', 'border-transparent');
            
            // Get the filter category
            const category = this.getAttribute('data-filter');
            
            // Filter the cards
            groupCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (cardCategory === category) {
                    card.classList.remove('hidden');
                    // Add fade-in animation
                    card.style.animation = 'fadeIn 0.3s ease-in';
                } else {
                    card.classList.add('hidden');
                }
            });
            
            // Reset scroll position
            if (scrollContainer) {
                scrollContainer.scrollTop = 0;
            }
            updatePaginationDots();
        });
    });
    
    // Update pagination dots based on scroll position
    let scrollTimeout;
    function updatePaginationDots() {
        if (!scrollContainer) return;
        const scrollTop = scrollContainer.scrollTop;
        const scrollHeight = scrollContainer.scrollHeight;
        const clientHeight = scrollContainer.clientHeight;
        const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
        
        // Determine which page we're on (0-based index)
        const currentPage = Math.round(scrollPercentage);
        
        paginationDots.forEach((dot, index) => {
            if (index === currentPage) {
                dot.classList.remove('opacity-30');
                dot.classList.add('opacity-100');
            } else {
                dot.classList.remove('opacity-100');
                dot.classList.add('opacity-30');
            }
        });
    }
    
    // Snap to nearest page after scrolling stops
    function snapToPage() {
        if (!scrollContainer) return;
        const scrollTop = scrollContainer.scrollTop;
        const scrollHeight = scrollContainer.scrollHeight;
        const clientHeight = scrollContainer.clientHeight;
        const maxScroll = scrollHeight - clientHeight;
        
        // If scrolled past halfway, snap to page 2 (bottom), otherwise snap to page 1 (top)
        if (scrollTop > maxScroll / 2) {
            scrollContainer.scrollTo({ top: maxScroll, behavior: 'smooth' });
        } else {
            scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    // Listen to scroll events
    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', function() {
            updatePaginationDots();
            
            // Clear previous timeout
            clearTimeout(scrollTimeout);
            
            // Set new timeout to snap after scrolling stops
            scrollTimeout = setTimeout(snapToPage, 150);
        });
    }
    
    // Navigate to Discover Events with morph transition
    if (eventsCard) {
        eventsCard.addEventListener('click', function() {
            // Get the position and dimensions of the clicked Events card
            const cardRect = eventsCard.getBoundingClientRect();
            
            // Slide out explore header to the left
            if (exploreHeader) {
                exploreHeader.classList.remove('translate-x-0', 'opacity-100');
                exploreHeader.classList.add('-translate-x-full', 'opacity-0');
            }
            
            // Fade out other cards in explore section
            setTimeout(() => {
                exploreSection.classList.remove('opacity-100');
                exploreSection.classList.add('opacity-0');
            }, 100);
            
            // Hide original card
            eventsCard.style.opacity = '0';
            
            setTimeout(() => {
                // Hide explore section and show discover events section
                exploreSection.classList.add('hidden');
                discoverEventsSection.classList.remove('hidden');
                discoverEventsSection.classList.remove('opacity-0');
                discoverEventsSection.classList.add('opacity-100');
                
                // Get the final blue box position
                const blueBoxRect = eventsBlueBoxContainer.getBoundingClientRect();
                
                // Calculate scale factors
                const scaleX = cardRect.width / blueBoxRect.width;
                const scaleY = cardRect.height / blueBoxRect.height;
                
                // Calculate translation needed
                const translateX = cardRect.left - blueBoxRect.left;
                const translateY = cardRect.top - blueBoxRect.top;
                
                // Set initial state: blue box starts at card position/size
                eventsBlueBoxContainer.style.transformOrigin = 'top left';
                eventsBlueBoxContainer.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
                eventsBlueBoxContainer.style.opacity = '1';
                eventsBlueBoxContainer.style.transition = 'none';
                
                // Hide events initially
                const allEventCards = document.querySelectorAll('.event-card');
                allEventCards.forEach(card => {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                });
                
                // Force reflow
                eventsBlueBoxContainer.offsetHeight;
                
                // Animate to final position
                setTimeout(() => {
                    eventsBlueBoxContainer.style.transition = 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
                    eventsBlueBoxContainer.style.transform = 'translate(0, 0) scale(1, 1)';
                    
                    // Slide in events header from the right
                    if (eventsHeader) {
                        eventsHeader.classList.remove('translate-x-full', 'opacity-0');
                        eventsHeader.classList.add('translate-x-0', 'opacity-100');
                    }
                    
                    // Fade in event cards with stagger effect after box expands
                    setTimeout(() => {
                        allEventCards.forEach((card, index) => {
                            setTimeout(() => {
                                card.style.transition = 'all 0.5s ease-in-out';
                                card.style.opacity = '1';
                                card.style.transform = 'scale(1)';
                            }, index * 80);
                        });
                    }, 400);
                }, 50);
                
                // Reset for next time
                eventsCard.style.opacity = '1';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 500);
        });
    }
    
    // Navigate back to Explore from Events
    if (backToExploreFromEventsBtn) {
        backToExploreFromEventsBtn.addEventListener('click', function() {
            // Slide out events header to the left
            if (eventsHeader) {
                eventsHeader.classList.remove('translate-x-0', 'opacity-100');
                eventsHeader.classList.add('-translate-x-full', 'opacity-0');
            }
            
            // Fade out discover events section
            setTimeout(() => {
                discoverEventsSection.classList.remove('opacity-100');
                discoverEventsSection.classList.add('opacity-0');
                eventsBlueBoxContainer.style.opacity = '0';
            }, 200);
            
            setTimeout(() => {
                // Reset blue box transform
                eventsBlueBoxContainer.style.transform = 'translate(0, 0) scale(1, 1)';
                eventsBlueBoxContainer.style.transformOrigin = 'top left';
                
                // Hide discover events and show explore
                discoverEventsSection.classList.add('hidden');
                exploreSection.classList.remove('hidden');
                
                // Reset events header position for next time
                if (eventsHeader) {
                    eventsHeader.classList.remove('-translate-x-full');
                    eventsHeader.classList.add('translate-x-full');
                }
                
                // Fade in explore section
                setTimeout(() => {
                    exploreSection.classList.remove('opacity-0');
                    exploreSection.classList.add('opacity-100');
                    
                    // Slide in explore header from the right
                    if (exploreHeader) {
                        exploreHeader.classList.remove('-translate-x-full', 'opacity-0');
                        exploreHeader.classList.add('translate-x-0', 'opacity-100');
                    }
                }, 50);
                
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 500);
        });
    }
    
    // Initial update
    updatePaginationDots();
});
