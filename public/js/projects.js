// Global marker storage
let projectMarkers = [];

function focusProject(index) {
    if (projectMarkers[index]) {
        const marker = projectMarkers[index];
        const mapDiv = document.getElementById('projects-map');
        
        // Scroll to map if not in view
        mapDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        setTimeout(() => {
            marker.map.setView(marker.getLatLng(), 10);
            marker.openPopup();
        }, 300);
    }
}

function initProjectsMap(projects) {
    // Initialize map
    const map = L.map('projects-map', {
        scrollWheelZoom: false,
        zoomSnap: 0.5,
        minZoom: 2
    }).setView([20, 0], 2);

    // Add CartoDB Voyager Tile Layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    const iconMap = {
        'feather': 'fa-solid fa-feather-pointed',
        'paw': 'fa-solid fa-paw',
        'frog': 'fa-solid fa-frog',
        'water': 'fa-solid fa-droplet',
        'bug': 'fa-solid fa-bug',
        'fish': 'fa-solid fa-fish',
        'leaf': 'fa-solid fa-leaf',
        'cog': 'fa-solid fa-gear'
    };

    projects.forEach((project, index) => {
        if (project.Latitude == null || project.Longitude == null) {
            projectMarkers[index] = null;
            return;
        }

        const iconClass = iconMap[project['Species Icon']] || 'fa-solid fa-location-dot';
        const imageUrl = project['Species Image'] || `/img/dummy_project_image.png`;

        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `<i class="${iconClass}"></i>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        let popupHtml = `
            <div class="map-popup">
                <div class="popup-header">
                    <div class="popup-image-container">
                        <img src="${imageUrl}" class="popup-image" alt="${project['Project name']}">
                    </div>
                    <div class="popup-header-info">
                        <div class="popup-title" title="${project['Project name']}">${project['Project name']}</div>
                        <div class="popup-org" title="${project['Organization/Project lead'] || project['Country']}">${project['Organization/Project lead'] || project['Country']}</div>
                    </div>
                </div>
                <div class="popup-body">
                    <div class="popup-meta-item">
                        <i class="fa-solid fa-tag"></i>
                        <span>${project['Target species']}</span>
                    </div>
                    <div class="popup-meta-item">
                        <i class="fa-solid fa-location-dot"></i>
                        <span>${project['Region/Location']}, ${project['Country']}</span>
                    </div>
                    <div class="popup-links">
                        ${project['Website'] ? `<a href="${project['Website']}" target="_blank" class="btn btn-primary text-white">Website</a>` : ''}
                        ${project['Paper'] ? `<a href="${project['Paper']}" target="_blank" class="btn btn-outline-dark">Paper</a>` : ''}
                    </div>
                </div>
            </div>
        `;

        const marker = L.marker([project.Latitude, project.Longitude], { icon: customIcon })
            .bindPopup(popupHtml)
            .addTo(map);
        
        // Save marker for jumping to it
        marker.map = map;
        projectMarkers[index] = marker;
    });
}
