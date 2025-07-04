document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project');
    
    if (projectId) {
        loadProject(projectId);
    } else {
        // If no project specified, redirect to home
        window.location.href = 'index.html#portfolio';
    }
});

async function loadProject(projectId) {
    try {
        const response = await fetch('/assets/data/portfolio.json');
        const data = await response.json();
        
        const project = data.projects.find(p => p.id === projectId);
        
        if (!project) {
            console.error('Project not found:', projectId);
            window.location.href = 'index.html#portfolio';
            return;
        }
        
        updateProjectContent(project);
        
        // Handle hash/anchor navigation after content is loaded
        setTimeout(() => {
            if (window.location.hash) {
                const targetElement = document.querySelector(window.location.hash);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        }, 500);
        
    } catch (error) {
        console.error('Error loading portfolio data:', error);
        window.location.href = 'index.html#portfolio';
    }
}

function updateProjectContent(project) {
    // Update page title
    document.title = `${project.title} - Mladen Raykov Portfolio`;
    
    // Update breadcrumb
    const breadcrumbCurrent = document.querySelector('.breadcrumbs .current');
    if (breadcrumbCurrent) {
        breadcrumbCurrent.textContent = project.title;
    }
    
    // Update page title heading
    const pageTitle = document.querySelector('.page-title h1');
    if (pageTitle) {
        pageTitle.textContent = project.title;
    }
    
    // Update portfolio images (Swiper)
    const portfolioImages = document.querySelector('#portfolio-images');
    if (portfolioImages && project.images && project.images.length > 0) {
        const imagesHtml = project.images.map((image, index) => {
            const description = project.descriptions && project.descriptions[index] ? project.descriptions[index] : '';
            return `
                <div class="swiper-slide">
                    <img src="${image}" alt="${project.title}" class="img-fluid" loading="lazy">
                    ${description ? `<div class="swiper-slide-caption">${description}</div>` : ''}
                </div>
            `;
        }).join('');
        
        portfolioImages.innerHTML = imagesHtml;
        
        // Properly reinitialize Swiper after content change
        setTimeout(() => {
            const swiperContainer = document.querySelector('.portfolio-details-slider');
            if (swiperContainer) {
                // Destroy existing swiper instance if it exists
                if (swiperContainer.swiper) {
                    swiperContainer.swiper.destroy(true, true);
                }
                
                // Swiper configuration defined in JavaScript
                const config = {
                    loop: true,
                    speed: 600,
                    autoplay: {
                        delay: 5000
                    },
                    slidesPerView: "auto",
                    pagination: {
                        el: ".swiper-pagination",
                        type: "bullets",
                        clickable: true
                    }
                };
                
                // Count the actual number of slides
                const slideCount = swiperContainer.querySelectorAll('.swiper-slide').length;
                
                // Disable loop if we have fewer than 3 slides to prevent warning
                if (slideCount < 3) {
                    config.loop = false;
                }
                
                // Initialize new Swiper instance
                new Swiper(swiperContainer, config);
            }
        }, 200);
    }
    
    // Update project info
    const projectInfoSection = document.querySelector('.portfolio-info');
    if (projectInfoSection) {
        projectInfoSection.innerHTML = `
            <h3>Project Information</h3>
            <ul>
                <li><strong>Category</strong>: ${project.category}</li>
                <li><strong>Client</strong>: ${project.client}</li>
                <li><strong>Project date</strong>: ${project.date}</li>
                <li><strong>Project URL</strong>: <a href="${project.url}" target="_blank">${project.url}</a></li>
            </ul>
        `;
    }
    
    // Update project description and features
    const projectDescription = document.querySelector('.portfolio-description');
    if (projectDescription) {
        let technologiesHtml = '';
        if (project.technologies && project.technologies.length > 0) {
            technologiesHtml = `
                <div class="technologies mt-4" id="technologies">
                    <h3>Technologies Used</h3>
                    <div class="technologies-list d-flex flex-wrap gap-2">
                        ${project.technologies.map(tech => `<span class="badge badge-tech">${tech}</span>`).join('')}
                    </div>
                </div>
            `;
        }
        
        let featuresHtml = '';
        if (project.features && project.features.length > 0) {
            // Split features into groups of 2 for better layout
            const featureGroups = [];
            for (let i = 0; i < project.features.length; i += 2) {
                featureGroups.push(project.features.slice(i, i + 2));
            }
            
            featuresHtml = `
                <div class="features mt-4" id="features">
                    <h3>Key Features</h3>
                    <div class="row gy-3">
                        ${featureGroups.map((group, groupIndex) => 
                            group.map((feature, featureIndex) => `
                                <div class="col-md-6">
                                    <div class="feature-item" data-aos="fade-up" data-aos-delay="${400 + (groupIndex * 2 + featureIndex) * 100}">
                                        <i class="bi bi-check-circle-fill"></i>
                                        <h4>${feature}</h4>
                                    </div>
                                </div>
                            `).join('')
                        ).join('')}
                    </div>
                </div>
            `;
        }
        
        // Create detailed sections if available
        let detailedSectionsHtml = '';
        if (project.motivations || project.problems || project.challenges || project['technical-details'] || project.results || project.feedback) {
            detailedSectionsHtml = `
                <div class="detailed-sections mt-5">
                    ${project.motivations ? `
                        <div class="detail-section mb-4" id="motivations">
                            <h3><i class="bi bi-lightbulb me-2"></i>${project.motivations.title}</h3>
                            <p>${project.motivations.description}</p>
                        </div>
                    ` : ''}
                    
                    ${project.problems ? `
                        <div class="detail-section mb-4" id="problems">
                            <h3><i class="bi bi-gear me-2"></i>${project.problems.title}</h3>
                            <p>${project.problems.description}</p>
                        </div>
                    ` : ''}
                    
                    ${project.challenges ? `
                        <div class="detail-section mb-4" id="challenges">
                            <h3><i class="bi bi-exclamation-triangle me-2"></i>${project.challenges.title}</h3>
                            <p>${project.challenges.description}</p>
                        </div>
                    ` : ''}
                    
                    ${project['technical-details'] ? `
                        <div class="detail-section mb-4" id="technical-details">
                            <h3><i class="bi bi-code-slash me-2"></i>${project['technical-details'].title}</h3>
                            <p>${project['technical-details'].description}</p>
                        </div>
                    ` : ''}
                    
                    ${project.results ? `
                        <div class="detail-section mb-4" id="results">
                            <h3><i class="bi bi-trophy me-2"></i>${project.results.title}</h3>
                            <p>${project.results.description}</p>
                        </div>
                    ` : ''}
                    
                    ${project.feedback ? `
                        <div class="detail-section mb-4" id="feedback">
                            <h3><i class="bi bi-chat-quote me-2"></i>${project.feedback.title}</h3>
                            <p>${project.feedback.description}</p>
                        </div>
                    ` : ''}
                </div>
            `;
        }
        
        projectDescription.innerHTML = `
            <h2>Project Overview</h2>
            <p>${project.projectOverview}</p>
            ${detailedSectionsHtml}
            ${technologiesHtml}
            ${featuresHtml}
        `;
    }
}