/**
 * ===================================================
 * EQTECH CMS PRO - Firebase Module
 * Real-time Database, Authentication, Image Management
 * ===================================================
 */

// ============================================
// CONFIGURATION & INITIALIZATION
// ============================================

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCDwrcSUh_EWru1fBuQ4Zh27knsMkPAUeY",
  authDomain: "content-administration.firebaseapp.com",
  projectId: "content-administration",
  storageBucket: "content-administration.firebasestorage.app",
  messagingSenderId: "1091836073373",
  appId: "1:1091836073373:web:fa861463bb9fed75f1cb74",
};

const CLOUDINARY_CONFIG = {
  CLOUD_NAME: "dcbxuax2c",
  UPLOAD_PRESET: "web_gallery",
};

// Admin access is controlled by email address
const ADMIN_EMAILS = ["admin@eqtechjo.com"];

// Initialize Firebase
firebase.initializeApp(FIREBASE_CONFIG);
const db = firebase.firestore();
const auth = firebase.auth();

// ============================================
// STATE MANAGEMENT - OPTIMIZED
// ============================================

const AppState = {
  clients: [],
  currentEditId: null,
  currentFilter: "All",
  dateRangeFilter: { from: null, to: null },
  isLoading: false,
  unsubscribe: null,
  // Performance optimizations
  _renderDebounceTimer: null,
  _searchDebounceTimer: null,
  _cachedClients: new Map(), // Cache for frequently accessed clients
  _eventListeners: new WeakMap(), // Track event listeners for cleanup

  setClients(clients) {
    const uniqueClients = [];
    const seenIds = new Set();

    clients.forEach((client) => {
      if (!client || !client.id) return;
      if (seenIds.has(client.id)) return;
      seenIds.add(client.id);
      uniqueClients.push(client);
    });

    this.clients = uniqueClients;
    // Cache clients for faster lookups
    this._cachedClients.clear();
    uniqueClients.forEach((client) =>
      this._cachedClients.set(client.id, client),
    );
  },

  getClients() {
    return this.clients;
  },

  getClientById(id) {
    return this._cachedClients.get(id) || this.clients.find((c) => c.id === id);
  },

  setCurrentEditId(id) {
    this.currentEditId = id;
  },

  getCurrentEditId() {
    return this.currentEditId;
  },

  setCurrentFilter(filter) {
    this.currentFilter = filter;
    this._debouncedRender();
  },

  getCurrentFilter() {
    return this.currentFilter;
  },

  isAdmin: false,

  setAdmin(isAdmin) {
    this.isAdmin = Boolean(isAdmin);
  },

  setDateRangeFilter(from, to) {
    this.dateRangeFilter = { from, to };
    this._debouncedRender();
  },

  getDateRangeFilter() {
    return this.dateRangeFilter;
  },

  setLoading(loading) {
    this.isLoading = loading;
  },

  isLoadingData() {
    return this.isLoading;
  },

  // Refresh state tracking
  _isRefreshing: false,
  _lastRefreshTime: 0,

  setRefreshing(refreshing) {
    this._isRefreshing = refreshing;
    if (refreshing) {
      this._lastRefreshTime = Date.now();
      // Notify UI of refresh state
      document.body.setAttribute("data-refreshing", "true");
    } else {
      document.body.removeAttribute("data-refreshing");
    }
  },

  isRefreshing() {
    return this._isRefreshing;
  },

  // Debounced rendering to prevent excessive re-renders
  _debouncedRender() {
    if (this._renderDebounceTimer) {
      clearTimeout(this._renderDebounceTimer);
    }
    this._renderDebounceTimer = setTimeout(() => {
      Renderer.renderClients();
    }, 100); // 100ms debounce
  },

  // Debounced search to prevent excessive filtering
  _debouncedSearch() {
    if (this._searchDebounceTimer) {
      clearTimeout(this._searchDebounceTimer);
    }
    this._searchDebounceTimer = setTimeout(() => {
      Renderer.renderClients();
    }, 150); // 150ms debounce for search
  },

  // Cleanup method for memory management
  cleanup() {
    if (this._renderDebounceTimer) {
      clearTimeout(this._renderDebounceTimer);
    }
    if (this._searchDebounceTimer) {
      clearTimeout(this._searchDebounceTimer);
    }
    this._cachedClients.clear();
  },
};

// ============================================
// UI UTILITIES - HIGHLY OPTIMIZED
// ============================================

const UI = {
  // Enhanced DOM element caching with WeakMap for memory efficiency
  _elements: new WeakMap(),
  _eventDelegates: new Map(), // Track delegated event listeners

  _getElement(id) {
    let element = this._elements.get(document);
    if (!element || !element[id]) {
      element = element || {};
      element[id] = document.getElementById(id);
      this._elements.set(document, element);
    }
    return element[id];
  },

  // Event delegation system for optimal performance
  delegateEvent(eventType, selector, handler, container = document) {
    const key = `${eventType}-${selector}`;
    if (this._eventDelegates.has(key)) {
      return; // Already delegated
    }

    const delegatedHandler = (e) => {
      const target = e.target.closest(selector);
      if (target && container.contains(target)) {
        handler.call(target, e);
      }
    };

    container.addEventListener(eventType, delegatedHandler, { passive: true });
    this._eventDelegates.set(key, delegatedHandler);
  },

  showLoader() {
    const loader = this._getElement("loader");
    if (loader) {
      loader.style.display = "flex";
      // Use transform instead of changing display for better performance
      loader.style.transform = "scale(1)";
      loader.style.opacity = "1";
    }
  },

  hideLoader() {
    const loader = this._getElement("loader");
    if (loader) {
      // Smooth fade out with transform for better performance
      loader.style.transform = "scale(0.8)";
      loader.style.opacity = "0";
      setTimeout(() => {
        loader.style.display = "none";
      }, 200);
    }
  },

  openModal() {
    const modal = this._getElement("modal");
    if (modal) {
      modal.style.display = "flex";
      // Use transform and opacity for hardware acceleration
      modal.style.transform = "scale(1)";
      modal.style.opacity = "1";
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    }
  },

  closeModal() {
    const modal = this._getElement("modal");
    if (modal) {
      modal.style.transform = "scale(0.95)";
      modal.style.opacity = "0";
      setTimeout(() => {
        modal.style.display = "none";
        // Restore body scroll
        document.body.style.overflow = "";
      }, 150);
    }
  },

  showToast(message, type = "success") {
    const toast = this._getElement("toast");
    if (!toast) return;

    // Cancel any existing timeout
    if (toast._timeoutId) {
      clearTimeout(toast._timeoutId);
    }

    toast.textContent = message;
    toast.className = "show";
    if (type === "error") toast.classList.add("error");

    toast._timeoutId = setTimeout(() => {
      toast.classList.remove("show", "error");
      toast._timeoutId = null;
    }, 3000);
  },

  clearForm() {
    // Use DocumentFragment for batch DOM operations
    const fragment = document.createDocumentFragment();

    // Clear inputs efficiently using a single query
    const inputs = document.querySelectorAll("#modal input, #modal textarea");
    inputs.forEach((el) => {
      el.value = "";
    });

    // Reset select elements
    const statusSelect = this._getElement("status-select");
    if (statusSelect) statusSelect.value = "New";

    // Clear file input
    const fileInput = this._getElement("fileInput");
    if (fileInput) {
      fileInput.value = "";
      fileInput._renamedFile = null;
    }

    // Clear containers
    const servicesContainer = this._getElement("servicesContainer");
    if (servicesContainer) servicesContainer.innerHTML = "";

    const preview = this._getElement("preview");
    if (preview) preview.innerHTML = "";
  },

  disableButton(selector, disable = true) {
    const btn = document.querySelector(selector);
    if (btn) {
      btn.disabled = disable;
      btn.style.pointerEvents = disable ? "none" : "";
      const btnText = btn.querySelector(".btn-text");
      const btnSpinner = btn.querySelector(".btn-spinner");

      if (btnText && btnSpinner) {
        if (disable) {
          btnText.style.display = "none";
          btnSpinner.style.display = "inline-block";
        } else {
          btnText.style.display = "inline";
          btnSpinner.style.display = "none";
        }
      } else {
        // Fallback for buttons without spinner
        btn.textContent = disable ? "Saving..." : "Save";
      }
    }
  },

  getFormData() {
    // Use cached elements for better performance
    const elements = {
      name: this._getElement("companyName"),
      businessType: this._getElement("businessType"),
      phone: this._getElement("phone"),
      email: this._getElement("email"),
      description: this._getElement("description"),
      address: this._getElement("address"),
      googleMapsLink: this._getElement("googleMapsLink"),
      website: this._getElement("website"),
      instagram: this._getElement("instagram"),
      facebook: this._getElement("facebook"),
      whatsapp: this._getElement("whatsapp"),
      responsibleName: this._getElement("responsibleName"),
      responsiblePhone: this._getElement("responsiblePhone"),
      responsibleEmail: this._getElement("responsibleEmail"),
      status: this._getElement("status-select"),
    };

    // Collect phone numbers
    const phoneInputs = document.querySelectorAll(".phone-input");
    const phones = Array.from(phoneInputs)
      .map((input) => input.value.trim())
      .filter((phone) => phone);

    const form = {
      name: elements.name?.value?.trim() || "",
      businessType: elements.businessType?.value?.trim() || "",
      phone: phones, // Now an array
      email: elements.email?.value?.trim() || "",
      description: elements.description?.value?.trim() || "",
      address: elements.address?.value?.trim() || "",
      googleMapsLink: elements.googleMapsLink?.value?.trim() || "",
      website: elements.website?.value?.trim() || "",
      instagram: elements.instagram?.value?.trim() || "",
      facebook: elements.facebook?.value?.trim() || "",
      whatsapp: elements.whatsapp?.value?.trim() || "",
      responsibleName: elements.responsibleName?.value?.trim() || "",
      responsiblePhone: elements.responsiblePhone?.value?.trim() || "",
      responsibleEmail: elements.responsibleEmail?.value?.trim() || "",
      status: elements.status?.value || "New",
      logo: this._currentLogoUrl || null, // Will be set during logo upload
    };

    // Optimized service collection using cached container
    const servicesContainer = this._getElement("servicesContainer");
    const services = [];
    if (servicesContainer) {
      const serviceItems = servicesContainer.querySelectorAll(".service-item");
      serviceItems.forEach((item) => {
        const inputs = item.querySelectorAll("input");
        const title = inputs[0]?.value?.trim() || "";
        const desc = inputs[1]?.value?.trim() || "";
        if (title || desc) services.push({ title, desc });
      });
    }
    form.services = services;

    return form;
  },

  setFormData(data) {
    // Use cached elements for better performance
    const elements = {
      name: this._getElement("companyName"),
      businessType: this._getElement("businessType"),
      phone: this._getElement("phone"),
      email: this._getElement("email"),
      description: this._getElement("description"),
      address: this._getElement("address"),
      googleMapsLink: this._getElement("googleMapsLink"),
      website: this._getElement("website"),
      instagram: this._getElement("instagram"),
      facebook: this._getElement("facebook"),
      whatsapp: this._getElement("whatsapp"),
      responsibleName: this._getElement("responsibleName"),
      responsiblePhone: this._getElement("responsiblePhone"),
      responsibleEmail: this._getElement("responsibleEmail"),
      status: this._getElement("status-select"),
      services: this._getElement("servicesContainer"),
    };

    // Clear existing phone inputs
    const phoneContainer = document.getElementById("phoneContainer");
    phoneContainer.innerHTML = "";

    // Add phone inputs
    const phones = Array.isArray(data.phone)
      ? data.phone
      : [data.phone].filter((p) => p);
    phones.forEach((phone) => {
      const phoneGroup = document.createElement("div");
      phoneGroup.className = "phone-input-group";
      phoneGroup.innerHTML = `
        <input type="tel" class="phone-input" value="${phone}" placeholder="Enter phone number" aria-label="Phone number">
        <button type="button" class="remove-phone-btn" onclick="this.parentElement.remove()" style="display: ${phones.length > 1 ? "flex" : "none"}">
          <i class="fas fa-times"></i>
        </button>
      `;
      phoneContainer.appendChild(phoneGroup);
    });

    // If no phones, add one empty input
    if (phones.length === 0) {
      const phoneGroup = document.createElement("div");
      phoneGroup.className = "phone-input-group";
      phoneGroup.innerHTML = `
        <input type="tel" class="phone-input" placeholder="Enter phone number" aria-label="Phone number">
        <button type="button" class="remove-phone-btn" onclick="this.parentElement.remove()" style="display: none">
          <i class="fas fa-times"></i>
        </button>
      `;
      phoneContainer.appendChild(phoneGroup);
    }

    // Batch DOM updates using requestAnimationFrame for optimal performance
    requestAnimationFrame(() => {
      // Set form values
      Object.entries({
        name: data.name || "",
        businessType: data.businessType || "",
        email: data.email || "",
        description: data.description || "",
        address: data.address || "",
        googleMapsLink: data.googleMapsLink || "",
        website: data.website || "",
        instagram: data.instagram || "",
        facebook: data.facebook || "",
        whatsapp: data.whatsapp || "",
        responsibleName: data.responsiblePerson?.name || "",
        responsiblePhone: data.responsiblePerson?.phone || "",
        responsibleEmail: data.responsiblePerson?.email || "",
      }).forEach(([key, value]) => {
        if (elements[key]) elements[key].value = value;
      });

      if (elements.status) elements.status.value = data.status || "New";

      // Defer services loading to prevent blocking - optimized
      if (elements.services && data.services?.length > 0) {
        setTimeout(() => {
          elements.services.innerHTML = "";
          const fragment = document.createDocumentFragment();
          data.services.forEach((service) => {
            const div = this.createServiceItem(
              service.title || "",
              service.desc || "",
            );
            fragment.appendChild(div);
          });
          elements.services.appendChild(fragment);
        }, 0);
      }
    });
  },

  createServiceItem(title = "", desc = "") {
    const div = document.createElement("div");
    div.className = "service-item";
    div.innerHTML = `
      <input type="text" placeholder="Service Title" value="${title}" />
      <input type="text" placeholder="Service Description" value="${desc}" />
      <button type="button" onclick="ServiceManager.removeService(this)">Delete</button>
    `;
    return div;
  },
};

// ============================================
// VALIDATION & UTILITIES
// ============================================

const Validator = {
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
    return phoneRegex.test(phone) || phone === "";
  },

  validateURL(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return url === "";
    }
  },

  validateForm(formData) {
    const errors = [];

    // All fields are optional - only validate format if provided
    if (formData.email && !this.validateEmail(formData.email)) {
      errors.push("Invalid email format");
    }

    if (formData.phone && !this.validatePhone(formData.phone)) {
      errors.push("Invalid phone format");
    }

    if (formData.website && !this.validateURL(formData.website)) {
      errors.push("Invalid website URL");
    }

    if (formData.instagram && !this.validateURL(formData.instagram)) {
      errors.push("Invalid Instagram URL");
    }

    if (formData.facebook && !this.validateURL(formData.facebook)) {
      errors.push("Invalid Facebook URL");
    }

    return { valid: errors.length === 0, errors };
  },

  // Sanitize filename according to naming rules
  sanitizeFilename(filename) {
    if (!filename) return "";

    // Get extension
    const ext = filename.split(".").pop().toLowerCase();
    // Remove extension from name
    let name = filename.substring(0, filename.lastIndexOf("."));

    // Convert to lowercase
    name = name.toLowerCase();
    // Replace spaces and underscores with dashes
    name = name.replace(/[\s_]+/g, "-");
    // Remove any characters that aren't alphanumeric, dash, or underscore
    name = name.replace(/[^a-z0-9\-]/g, "");
    // Remove multiple consecutive dashes
    name = name.replace(/-+/g, "-");
    // Remove leading/trailing dashes
    name = name.replace(/^-+|-+$/g, "");

    return `${name || "file"}.${ext}`;
  },
};

// ============================================
// SERVICE MANAGEMENT
// ============================================

const ServiceManager = {
  addService(title = "", desc = "") {
    const container = document.getElementById("servicesContainer");
    if (!container) return;

    const div = UI.createServiceItem(title, desc);
    container.appendChild(div);
  },

  removeService(button) {
    button.parentElement.remove();
  },

  getServices() {
    const services = [];
    document.querySelectorAll(".service-item").forEach((el) => {
      const inputs = el.querySelectorAll("input");
      const title = inputs[0]?.value || "";
      const desc = inputs[1]?.value || "";
      if (title || desc) services.push({ title, desc });
    });
    return services;
  },
};

// ============================================
// IMAGE MANAGEMENT - HIGHLY OPTIMIZED
// ============================================

const ImageManager = {
  // Upload queue for batch processing
  _uploadQueue: [],
  _isUploading: false,
  _maxConcurrentUploads: 3,

  async uploadToFirebaseStorage(file) {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9\-_\.]/g, "_")}`;

        reader.onload = function (e) {
          resolve({
            url: e.target.result, // Data URL
            publicId: fileName,
            timestamp: timestamp,
          });
        };

        reader.onerror = function (error) {
          reject(new Error("Failed to read file: " + error));
        };

        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Image conversion error:", error);
        reject(error);
      }
    });
  },

  generateImageName(originalName, timestamp) {
    // Optimized naming with sanitization
    const sanitized = originalName
      .replace(/[^a-zA-Z0-9\-_\.]/g, "_") // More efficient regex
      .substring(0, 50); // Shorter limit
    return `${sanitized}_${timestamp}`.substring(0, 100);
  },

  async handleFileUpload(files) {
    const preview = UI._getElement("preview");
    if (!preview) return [];

    // Validate files first
    const validFiles = Array.from(files).filter((file) => {
      if (!file.type.startsWith("image/")) {
        UI.showToast(`"${file.name}" is not an image`, "error");
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        UI.showToast(`"${file.name}" is too large (max 10MB)`, "error");
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return [];

    // Add to upload queue
    this._uploadQueue.push(...validFiles);

    // Start processing if not already uploading
    if (!this._isUploading) {
      return this._processUploadQueue();
    }

    return [];
  },

  async _processUploadQueue() {
    if (this._uploadQueue.length === 0) {
      this._isUploading = false;
      return [];
    }

    this._isUploading = true;
    const uploadedImages = [];

    // Process uploads in batches
    while (this._uploadQueue.length > 0) {
      const batch = this._uploadQueue.splice(0, this._maxConcurrentUploads);
      const batchPromises = batch.map((file) => this._uploadSingleFile(file));

      try {
        const results = await Promise.allSettled(batchPromises);
        results.forEach((result) => {
          if (result.status === "fulfilled") {
            uploadedImages.push(result.value);
          }
        });
      } catch (error) {
        console.error("Batch upload error:", error);
      }
    }

    this._isUploading = false;
    return uploadedImages;
  },

  async _uploadSingleFile(file) {
    try {
      UI.showToast(`Uploading ${file.name}...`);

      const uploadResult = await this.uploadToFirebaseStorage(file);
      const imageName = this.generateImageName(
        file.name,
        uploadResult.timestamp,
      );

      const imageData = {
        url: uploadResult.url,
        name: imageName,
        timestamp: uploadResult.timestamp,
        publicId: uploadResult.publicId,
      };

      this.displayPreview(imageData.url, imageData.name);
      UI.showToast(`${file.name} uploaded successfully`, "success");

      return imageData;
    } catch (error) {
      UI.showToast(`Failed to upload ${file.name}`, "error");
      throw error;
    }
  },

  displayPreview(url, name) {
    const preview = document.getElementById("preview");
    if (!preview) return;

    const div = document.createElement("div");
    div.className = "preview-item";
    div.innerHTML = `
      <img src="${url}" alt="${name}" />
      <input type="text" class="img-name" value="${name}" placeholder="Image name" />
      <button type="button" data-action="remove-preview">×</button>
    `;
    preview.appendChild(div);
  },

  removePreview(button) {
    button.parentElement.remove();
  },

  getPreviewImages() {
    const images = [];
    document.querySelectorAll(".preview-item").forEach((div) => {
      const img = div.querySelector("img");
      const input = div.querySelector(".img-name");

      if (img?.src) {
        images.push({
          url: img.src,
          name: (input?.value || "image").replace(/\s+/g, "_").toLowerCase(),
        });
      }
    });
    return images;
  },

  setupLogoUpload() {
    const logoInput = document.getElementById("logoUpload");
    const logoPreview = document.getElementById("logoPreview");

    if (!logoInput || !logoPreview) return;

    logoInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        UI.showToast("Please select a valid image file", "error");
        return;
      }

      // Show rename dialog
      this.showLogoRenameDialog(file, (renamedFile) => {
        if (!renamedFile) return; // User cancelled

        const reader = new FileReader();
        reader.onload = (event) => {
          const img = document.createElement("img");
          img.src = event.target.result;
          img.style.maxHeight = "120px";
          img.style.maxWidth = "100%";

          logoPreview.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
              ${img.outerHTML}
              <small style="color: var(--text-secondary); font-size: 11px;">Filename: ${renamedFile.name}</small>
              <button type="button" class="remove-logo-btn" style="padding: 5px 10px; background: var(--error-color); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                Remove Logo
              </button>
            </div>
          `;

          logoPreview
            .querySelector(".remove-logo-btn")
            .addEventListener("click", () => {
              logoInput.value = "";
              logoPreview.innerHTML = `<i class="fas fa-image"></i><p>Click to upload logo (PNG, JPG, GIF)</p>`;
            });

          // Store the renamed file for later upload
          logoInput._renamedFile = renamedFile;
        };
        reader.readAsDataURL(renamedFile);
      });
    });

    logoPreview.addEventListener("click", () => {
      logoInput.click();
    });
  },

  showLogoRenameDialog(file, callback) {
    const ext = file.name.split(".").pop();
    const currentName = file.name.substring(0, file.name.lastIndexOf("."));
    const sanitized = Validator.sanitizeFilename(file.name);

    // Create a modal for renaming
    const modal = document.createElement("div");
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    `;

    modal.innerHTML = `
      <div style="
        background: var(--bg-secondary);
        border: 1px solid var(--primary-color);
        border-radius: 8px;
        padding: 24px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 10px 40px rgba(0, 217, 255, 0.2);
      ">
        <h3 style="margin-bottom: 16px; color: var(--text-primary);">Rename Logo File</h3>
        <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">
          Keep it clean and descriptive. Use lowercase, dashes instead of spaces.
        </p>
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-size: 12px; color: var(--text-secondary); margin-bottom: 6px;">Filename:</label>
          <input
            type="text"
            value="${sanitized.substring(0, sanitized.lastIndexOf("."))}"
            placeholder="company-logo"
            style="
              width: 100%;
              padding: 10px;
              border: 1px solid var(--border-color);
              border-radius: 4px;
              background: var(--bg-primary);
              color: var(--text-primary);
              font-family: monospace;
              font-size: 12px;
              box-sizing: border-box;
            "
            id="logoFilenameInput"
          />
          <small style="color: var(--text-secondary); font-size: 11px; display: block; margin-top: 4px;">
            Extension: .${ext}
          </small>
        </div>
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
          <button
            type="button"
            onclick="this.closest('div').closest('div').close()"
            style="
              padding: 8px 16px;
              background: var(--border-color);
              color: var(--text-primary);
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 12px;
            "
          >
            Cancel
          </button>
          <button
            type="button"
            onclick="this.closest('div').closest('div').confirm()"
            style="
              padding: 8px 16px;
              background: var(--primary-color);
              color: var(--bg-primary);
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 12px;
              font-weight: 600;
            "
          >
            Use This Name
          </button>
        </div>
      </div>
    `;

    const input = modal.querySelector("#logoFilenameInput");
    let confirmed = false;

    modal.close = () => {
      modal.remove();
      if (!confirmed) callback(null);
    };

    modal.confirm = () => {
      let filename = input.value.trim();
      if (!filename) filename = "logo";

      // Sanitize the input
      filename = Validator.sanitizeFilename(filename + "." + ext);

      // Create a new File object with the renamed filename
      const renamedFile = new File([file], filename, { type: file.type });
      confirmed = true;
      modal.remove();
      callback(renamedFile);
    };

    // Allow Enter key to confirm
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") modal.confirm();
      if (e.key === "Escape") modal.close();
    });

    document.body.appendChild(modal);
    input.focus();
    input.select();
  },

  async uploadLogoFile(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_CONFIG.UPLOAD_PRESET);
      formData.append("folder", "eqtech_cms/images");
      formData.append(
        "public_id",
        file.name.substring(0, file.name.lastIndexOf(".")),
      );
      formData.append("tags", "eqtech,cms,logo");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Logo upload error:", error);
      UI.showToast("Failed to upload logo", "error");
      return null;
    }
  },
};

// ============================================
// RENDER & UI UPDATES - HIGHLY OPTIMIZED
// ============================================

const Renderer = {
  // Virtual scrolling state
  _virtualScrollState: {
    container: null,
    visibleItems: [],
    itemHeight: 280, // Approximate card height
    bufferSize: 5, // Items to render outside viewport
    scrollTop: 0,
    containerHeight: 0,
  },

  // Debounced render queue
  _renderQueue: [],
  _renderTimer: null,

  renderClients() {
    const container = this._getContainer();
    if (!container) return;

    const search = (document.querySelector(".search")?.value || "")
      .toLowerCase()
      .trim();
    const filter = AppState.getCurrentFilter().toLowerCase().trim();
    const dateFilter = AppState.getDateRangeFilter();

    // Optimized filtering with early returns
    let filtered = AppState.getClients().filter((client) => {
      // Status filter - normalize filter to lowercase for comparison
      const normalizedFilter = filter.toLowerCase();
      if (normalizedFilter !== "all") {
        const clientStatus = (client.status || "new").toLowerCase();
        if (clientStatus !== normalizedFilter) return false;
      }

      // IMPROVED Search filter - searches across multiple fields
      if (search) {
        const normalizeField = (field) => {
          if (Array.isArray(field)) {
            return field.filter(Boolean).join(" ");
          }
          if (field && typeof field === "object") {
            return Object.values(field).filter(Boolean).join(" ");
          }
          return String(field || "");
        };

        const searchableFields = [
          client.name,
          client.businessType,
          client.phone,
          client.email,
          client.description,
          client.address,
          client.website,
          client.status,
          client.responsiblePhone,
          client.responsibleEmail,
          client.companyName,
          client.responsiblePerson,
        ].map((field) => normalizeField(field).toLowerCase());

        const matchFound = searchableFields.some((field) =>
          field.includes(search),
        );
        if (!matchFound) return false;
      }

      // Date filter
      if (dateFilter.from && dateFilter.to) {
        const normalizeLocalDate = (value) => {
          const date = new Date(value);
          if (Number.isNaN(date.getTime())) return null;
          return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        };

        const scheduleDate = client.scheduleDate || client.created_at;
        const from = normalizeLocalDate(dateFilter.from);
        const to = normalizeLocalDate(dateFilter.to);
        if (from && to && scheduleDate) {
          const dateToCheck = normalizeLocalDate(scheduleDate);
          to.setHours(23, 59, 59, 999);
          if (!dateToCheck || dateToCheck < from || dateToCheck > to)
            return false;
        }
      }

      return true;
    });

    if (filtered.length === 0) {
      container.innerHTML =
        '<p style="opacity: 0.6; padding: 20px;">No clients found</p>';
      return;
    }

    // Use virtual scrolling for large lists (>50 items)
    if (filtered.length > 50) {
      this._renderVirtualList(container, filtered);
    } else {
      this._renderFullList(container, filtered);
    }
  },

  _renderFullList(container, clients) {
    // Use DocumentFragment for batch DOM operations
    const fragment = document.createDocumentFragment();

    clients.forEach((client) => {
      const card = this._createClientCard(client);
      fragment.appendChild(card);
    });

    container.innerHTML = "";
    container.appendChild(fragment);
  },

  _renderVirtualList(container, clients) {
    if (!this._virtualScrollState.container) {
      this._setupVirtualScrolling(container);
    }

    this._virtualScrollState.totalItems = clients.length;
    this._virtualScrollState.clients = clients;

    // Calculate visible range
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const itemHeight = this._virtualScrollState.itemHeight;
    const bufferSize = this._virtualScrollState.bufferSize;

    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / itemHeight) - bufferSize,
    );
    const endIndex = Math.min(
      clients.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + bufferSize,
    );

    // Only re-render if visible range changed
    if (
      this._virtualScrollState.startIndex !== startIndex ||
      this._virtualScrollState.endIndex !== endIndex
    ) {
      this._virtualScrollState.startIndex = startIndex;
      this._virtualScrollState.endIndex = endIndex;

      const fragment = document.createDocumentFragment();
      const visibleClients = clients.slice(startIndex, endIndex + 1);

      visibleClients.forEach((client, index) => {
        const card = this._createClientCard(client);
        card.style.position = "absolute";
        card.style.top = `${(startIndex + index) * itemHeight}px`;
        fragment.appendChild(card);
      });

      container.innerHTML = "";
      container.appendChild(fragment);

      // Set container height to enable scrolling
      container.style.height = `${clients.length * itemHeight}px`;
      container.style.position = "relative";
    }
  },

  _createClientCard(client) {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("data-client-id", client.id);

    const displayDate = client.scheduleDate
      ? new Date(client.scheduleDate).toLocaleDateString()
      : new Date(client.created_at || Date.now()).toLocaleDateString();

    // Display logo if available, otherwise show placeholder
    const logoHTML = client.logo
      ? `<img src="${client.logo}" alt="Company Logo" class="card-logo-img" />`
      : `<div class="card-logo-placeholder"><i class="fas fa-building"></i></div>`;

    const businessTypeHTML = client.businessType
      ? `<p class="card-business-type">${client.businessType}</p>`
      : "";

    const isAdmin = AppState.isAdmin;
    const adminActions = isAdmin
      ? `<button type="button" data-action="delete" data-client-id="${client.id}" style="background-color: var(--error-color); color: white; margin-left: 8px;"><i class="fas fa-trash-alt"></i> Delete</button>
         <button type="button" data-action="download" data-client-id="${client.id}" style="background-color: var(--info-color); color: white; margin-left: 8px;"><i class="fas fa-download"></i> Download</button>`
      : "";

    card.innerHTML = `
      <div class="card-header">
        <div class="card-logo">
          ${logoHTML}
        </div>
        <div class="card-title-section">
          <h3>${client.name || "No Name"}</h3>
          ${businessTypeHTML}
        </div>
      </div>
      <div class="card-body">
        <span class="status ${client.status || "New"}">${client.status || "New"}</span>
        <p class="card-date">${displayDate}</p>
      </div>
      <div class="card-footer">
        <button type="button" data-action="edit" data-client-id="${client.id}"><i class="fas fa-edit"></i> Edit</button>
        ${adminActions}
      </div>
    `;

    return card;
  },

  _getContainer() {
    if (!this._container) {
      this._container = document.getElementById("clients");
    }
    return this._container;
  },

  _setupVirtualScrolling(container) {
    this._virtualScrollState.container = container;
    container.addEventListener(
      "scroll",
      () => {
        if (this._virtualScrollState.totalItems > 50) {
          // Debounce scroll events
          if (this._renderTimer) clearTimeout(this._renderTimer);
          this._renderTimer = setTimeout(() => {
            this.renderClients();
          }, 16); // ~60fps
        }
      },
      { passive: true },
    );
  },

  setupFilterButtons() {
    // Use event delegation for better performance
    UI.delegateEvent("click", ".filter-btn", function () {
      // FIX: Exclude the clear filter button from status filter logic
      if (
        this.classList.contains("clear-filter-btn") ||
        this.classList.contains("secondary")
      ) {
        return;
      }

      // Extract only the text without icon
      const filterText = Array.from(this.childNodes)
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent.trim())
        .join("");
      const filterValue = filterText || this.textContent.trim();

      // Update active state efficiently
      document
        .querySelectorAll(".filters .filter-btn:not(.secondary)")
        .forEach((btn) => {
          btn.classList.remove("active");
          btn.setAttribute("aria-pressed", "false");
        });

      this.classList.add("active");
      this.setAttribute("aria-pressed", "true");

      AppState.setCurrentFilter(filterValue);
      // CRITICAL FIX: Re-render clients when filter changes (like search does)
      Renderer.renderClients();
    });
  },

  setupSearch() {
    const searchInput = document.querySelector(".search");
    if (searchInput) {
      // Debounced search for performance
      let searchTimeout;
      searchInput.addEventListener(
        "input",
        () => {
          clearTimeout(searchTimeout);
          searchTimeout = setTimeout(() => {
            AppState._debouncedSearch();
          }, 150);
        },
        { passive: true },
      );
    }
  },

  setupFileInput() {
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.addEventListener(
        "change",
        (e) => {
          ImageManager.handleFileUpload(e.target.files);
        },
        { passive: true },
      );
    }
  },

  setupModalButtons() {
    // Use event delegation for modal actions
    // Delegate client card actions
    UI.delegateEvent("click", "[data-action]", function () {
      const action = this.getAttribute("data-action");
      const clientId = this.getAttribute("data-client-id");

      if (action === "edit") {
        ClientManager.editClient(clientId);
        return;
      }

      if (!AppState.isAdmin) {
        UI.showToast("Only admin can delete or download", "error");
        return;
      }

      if (action === "delete") {
        ClientManager.deleteClient(clientId);
      } else if (action === "download") {
        ClientManager.downloadSite(clientId);
      }
    });

    // Delegate service actions
    UI.delegateEvent("click", "[onclick*='removeService']", function () {
      this.parentElement.remove();
    });

    UI.delegateEvent("click", "[data-action='remove-preview']", function () {
      this.parentElement.remove();
    });
  },
};

// ============================================
// CLIENT MANAGEMENT - HIGHLY OPTIMIZED
// ============================================

const ClientManager = {
  // Query optimization cache
  _queryCache: new Map(),
  _cacheExpiry: 5 * 60 * 1000, // 5 minutes

  openNewClientForm() {
    AppState.setCurrentEditId(null);
    UI.clearForm();
    UI.openModal();
  },

  setupRealtimeListener() {
    AppState.setLoading(true);

    if (AppState.unsubscribe) {
      AppState.unsubscribe();
    }

    // Optimized query with limit for better performance
    const query = db
      .collection("clients")
      .orderBy("updated_at", "desc")
      .limit(1000); // Reasonable limit to prevent memory issues

    AppState.unsubscribe = query.onSnapshot(
      (snapshot) => {
        const clients = [];
        snapshot.forEach((doc) => {
          clients.push({ id: doc.id, ...doc.data() });
        });

        // Only update if data actually changed
        const currentIds = AppState.getClients()
          .map((c) => c.id)
          .sort()
          .join(",");
        const newIds = clients
          .map((c) => c.id)
          .sort()
          .join(",");

        if (currentIds !== newIds) {
          AppState.setClients(clients);
          Renderer.renderClients();
        }

        AppState.setLoading(false);
        UI.hideLoader();
      },
      (error) => {
        console.error("Realtime listener error:", error);
        AppState.setLoading(false);
        UI.hideLoader();
        UI.showToast("Error loading clients", "error");
      },
    );
  },

  async deleteClient(id) {
    if (!id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this client? This action cannot be undone.",
    );
    if (!confirmed) return;

    try {
      AppState.setRefreshing(true);
      await db.collection("clients").doc(id).delete();

      const updatedClients = AppState.getClients().filter(
        (client) => client.id !== id,
      );
      AppState.setClients(updatedClients);
      AppState._cachedClients.delete(id);
      Renderer.renderClients();
      UI.showToast("Client deleted successfully", "success");
    } catch (error) {
      console.error("Delete client error:", error);
      UI.showToast("Failed to delete client", "error");
    } finally {
      AppState.setRefreshing(false);
    }
  },

  async editClient(id) {
    try {
      // Check cache first
      let data = AppState.getClientById(id);

      if (!data) {
        // Fetch from Firebase if not in cache
        const doc = await db.collection("clients").doc(id).get();
        if (!doc.exists) {
          UI.showToast("Client not found", "error");
          return;
        }
        data = doc.data();
      }

      AppState.setCurrentEditId(id);

      // Open modal first for instant UI feedback
      UI.openModal();

      // Use requestAnimationFrame to defer heavy operations
      requestAnimationFrame(() => {
        UI.clearForm();
        UI.setFormData(data);
loadNotes(data.notes || []);
        // Defer image loading to prevent blocking
        setTimeout(() => {
          this.loadClientImages(data.images || []);
        }, 0);
      });
    } catch (error) {
      console.error("Error editing client:", error);
      UI.showToast("Failed to load client", "error");
    }
  },

  loadClientImages(images) {
    const preview = UI._getElement("preview");
    if (!preview) return;

    // Clear existing content efficiently
    preview.innerHTML = "";

    if (!images || images.length === 0) return;

    // Use DocumentFragment for batch DOM operations
    const fragment = document.createDocumentFragment();

    // Smart loading: load first 5 images immediately, rest on demand
    const immediateLoad = Math.min(images.length, 5);
    const remainingImages = images.slice(immediateLoad);

    // Load immediate images
    for (let i = 0; i < immediateLoad; i++) {
      const img = images[i];
      const div = this.createImagePreview(img.url, img.name);
      fragment.appendChild(div);
    }

    preview.appendChild(fragment);

    // Lazy load remaining images with Intersection Observer for better performance
    if (remainingImages.length > 0) {
      this._setupLazyImageLoading(preview, remainingImages);
    }
  },

  _setupLazyImageLoading(container, images) {
    // Use Intersection Observer for efficient lazy loading
    if (!window.IntersectionObserver) {
      // Fallback for older browsers
      setTimeout(() => {
        const fragment = document.createDocumentFragment();
        images.forEach((img) => {
          const div = this.createImagePreview(img.url, img.name);
          fragment.appendChild(div);
        });
        container.appendChild(fragment);
      }, 100);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const fragment = document.createDocumentFragment();
            const batchSize = Math.min(images.length, 5); // Load in batches

            for (let i = 0; i < batchSize; i++) {
              const img = images.shift();
              if (img) {
                const div = this.createImagePreview(img.url, img.name);
                fragment.appendChild(div);
              }
            }

            container.appendChild(fragment);

            // Disconnect observer when all images are loaded
            if (images.length === 0) {
              observer.disconnect();
            }
          }
        });
      },
      {
        root: container,
        rootMargin: "50px", // Start loading 50px before entering viewport
        threshold: 0.1,
      },
    );

    // Create a sentinel element to trigger loading
    const sentinel = document.createElement("div");
    sentinel.style.height = "1px";
    sentinel.style.opacity = "0";
    container.appendChild(sentinel);

    observer.observe(sentinel);
  },

  createImagePreview(url, name) {
    const div = document.createElement("div");
    div.className = "preview-item";

    // Optimized image loading with lazy loading and error handling
    div.innerHTML = `
      <img src="${url}" alt="${name}" loading="lazy" decoding="async"
           onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOUI5QkE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4='"
           onload="this.style.opacity='1'" style="opacity:0; transition:opacity 0.2s;" />
      <input type="text" class="img-name" value="${name}" placeholder="Image name" />
      <button type="button" data-action="remove-preview">×</button>
    `;

    return div;
  },

  async saveClientWrapper() {
    const formData = UI.getFormData();
    const validation = Validator.validateForm(formData);

    if (!validation.valid) {
      UI.showToast(validation.errors.join(", "), "error");
      return;
    }

    const saveBtn = document.querySelector("#saveBtn");
    if (saveBtn) {
      saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
      saveBtn.disabled = true;
    }

    AppState.setRefreshing(true);

    try {
      // Handle logo upload if present
      const logoInput = document.getElementById("logoUpload");
      if (logoInput && logoInput._renamedFile) {
        UI.showToast("Uploading logo...");
        formData.logo = await ImageManager.uploadLogoFile(
          logoInput._renamedFile,
        );
      } else if (logoInput && logoInput.files.length > 0) {
        UI.showToast("Uploading logo...");
        formData.logo = await ImageManager.uploadLogoFile(logoInput.files[0]);
      }

      await this.saveClient(formData);
      // Show brief success feedback before closing modal
      await new Promise((resolve) => setTimeout(resolve, 200));
    } finally {
      if (saveBtn) {
        saveBtn.innerHTML = "Save";
        saveBtn.disabled = false;
      }
      AppState.setRefreshing(false);
    }
  },

  async saveClient(formData) {
    try {
      const images = ImageManager.getPreviewImages();

      // Collect phone numbers
      const phoneInputs = document.querySelectorAll(".phone-input");
      const phones = Array.from(phoneInputs)
        .map((input) => input.value.trim())
        .filter((phone) => phone);
const notes = getNotes();

const clientData = {
  name: formData.name,
  businessType: formData.businessType,
  phone: phones,
  email: formData.email,
  description: formData.description,
  address: formData.address,
  googleMapsLink: formData.googleMapsLink,
  website: formData.website,
  instagram: formData.instagram,
  facebook: formData.facebook,
  whatsapp: formData.whatsapp,
  services: formData.services,
  images: images,
  logo: formData.logo || null,
  status: formData.status,

  notes: notes, // ✅ هون الإضافة الصح

  responsiblePerson: {
    name: formData.responsibleName,
    phone: formData.responsiblePhone,
    email: formData.responsibleEmail,
  },

  updated_at: Date.now(), // ✅ داخل الأوبجكت مش برا
};
      const editId = AppState.getCurrentEditId();

      if (!editId) {
        // Create new client
        clientData.created_at = Date.now();
        clientData.history = ["Created"];

        const docRef = await db.collection("clients").add(clientData);
        const newClient = { id: docRef.id, ...clientData };

        AppState.setClients([...AppState.getClients(), newClient]);
        AppState._cachedClients.set(docRef.id, newClient);
        UI.showToast("Client created successfully", "success");
      } else {
        // Update existing client
        await db
          .collection("clients")
          .doc(editId)
          .update({
            ...clientData,
            history: firebase.firestore.FieldValue.arrayUnion("Updated"),
          });

        const updatedClients = AppState.getClients().map((client) => {
          if (client.id !== editId) return client;
          const existingHistory = Array.isArray(client.history)
            ? [...client.history, "Updated"]
            : ["Updated"];
          return {
            ...client,
            ...clientData,
            history: existingHistory,
          };
        });

        AppState.setClients(updatedClients);
        const updatedClient = updatedClients.find(
          (client) => client.id === editId,
        );
        if (updatedClient) {
          AppState._cachedClients.set(editId, updatedClient);
        }

        UI.showToast("Client updated successfully", "success");
      }

      // Immediately reflect changes in the UI
      Renderer.renderClients();

      // Reset form and close modal with smooth transition
      UI.clearForm();
      document.getElementById("fileInput").value = "";
      AppState.setCurrentEditId(null);

      // Close modal smoothly
      requestAnimationFrame(() => {
        UI.closeModal();
      });

      // Trigger data refresh for real-time sync
      await this._syncDataAfterSave();
    } catch (error) {
      console.error("Save error:", error);
      UI.showToast("Failed to save client", "error");
    }
  },

  async _syncDataAfterSave() {
    // Wait briefly for Firestore to process the update
    await new Promise((resolve) => setTimeout(resolve, 300));

    // The real-time listener will automatically update the UI
    // This ensures smooth data refresh without manual intervention
    // Visual feedback is provided via the refreshing state
  },

  async downloadSite(id) {
    try {
      UI.showToast("Preparing download...");

      // Lazy load JSZip if not already loaded
      if (!window.JSZip) {
        if (window.loadJSZip) {
          window.loadJSZip();
          // Wait for JSZip to load
          await new Promise((resolve) => {
            const checkJSZip = () => {
              if (window.JSZip) {
                resolve();
              } else {
                setTimeout(checkJSZip, 50);
              }
            };
            checkJSZip();
          });
        } else {
          throw new Error("JSZip loader not available");
        }
      }

      const doc = await db.collection("clients").doc(id).get();
      if (!doc.exists) {
        UI.showToast("Client not found", "error");
        return;
      }

      const data = doc.data();
      const zip = new JSZip();

      // Handle images
      const imgFolder = zip.folder("images");
      let imagesHTML = "";
      let logoHTML = "";

      if (data.images && data.images.length) {
        for (let i = 0; i < data.images.length; i++) {
          try {
            const img = data.images[i];
            const url = typeof img === "string" ? img : img.url;
            const rawName =
              typeof img === "string"
                ? `image_${i + 1}`
                : img.name || `image_${i + 1}`;

            const cleanName = rawName
              .replace(/\s+/g, "_")
              .replace(/[^\w\-]/g, "")
              .toLowerCase();
            const fileName = `${cleanName}.jpg`;

            const res = await fetch(url);
            const blob = await res.blob();
            imgFolder.file(fileName, blob);

            if (cleanName.includes("logo")) {
              logoHTML = `<img src="images/${fileName}" style="height:60px; margin-right: 15px;" alt="Logo" />`;
            }

            imagesHTML += `<img src="images/${fileName}" style="width:200px; margin:10px; border-radius:10px;" alt="${cleanName}" />`;
          } catch (err) {
            console.error("Image processing error:", err);
          }
        }
      }

      // Create HTML pages
      const indexHTML = this.generateIndexHTML(data, logoHTML, imagesHTML);
      const aboutHTML = this.generateAboutHTML(data);
      const servicesHTML = this.generateServicesHTML(data);
      const contactHTML = this.generateContactHTML(data);
      const css = this.generateCSS();
      const mainJs = this.generateMainJS();

      // Add files to zip
      zip.file("index.html", indexHTML);
      zip.file("about.html", aboutHTML);
      zip.file("services.html", servicesHTML);
      zip.file("contact.html", contactHTML);
      zip.folder("css").file("main.css", css);
      zip.folder("js").file("main.js", mainJs);

      // Generate and download
      zip.generateAsync({ type: "blob" }).then((content) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = `${(data.name || "website").replace(/\s+/g, "_")}_${Date.now()}.zip`;
        link.click();
        URL.revokeObjectURL(link.href);
        UI.showToast("Download started", "success");
      });
    } catch (error) {
      console.error("Download error:", error);
      UI.showToast("Failed to generate download", "error");
    }
  },

  generateIndexHTML(data, logoHTML, imagesHTML) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.name || "Website"}</title>
  <link rel="stylesheet" href="css/main.css">
</head>
<body>
  <header>
    <div class="header-content">
      ${logoHTML}
      <h1>${data.name || "Welcome"}</h1>
    </div>
    <nav>
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href="services.html">Services</a>
      <a href="contact.html">Contact</a>
    </nav>
  </header>
  
  <main>
    <section class="welcome">
      <h2>Welcome</h2>
      <p>${data.description || "Welcome to our website"}</p>
    </section>

    <section class="gallery">
      <h2>Gallery</h2>
      <div class="images">
        ${imagesHTML || "<p>No images available</p>"}
      </div>
    </section>
  </main>

  <footer>
    <p>&copy; ${new Date().getFullYear()} ${data.name || "Company"}. All rights reserved.</p>
  </footer>
  
  <script src="js/main.js"><\/script>
</body>
</html>`;
  },

  generateAboutHTML(data) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About - ${data.name || "Company"}</title>
  <link rel="stylesheet" href="css/main.css">
</head>
<body>
  <header>
    <h1>${data.name || "Company"}</h1>
    <nav>
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href="services.html">Services</a>
      <a href="contact.html">Contact</a>
    </nav>
  </header>

  <main>
    <section>
      <h2>About Us</h2>
      <p>${data.description || "Learn more about our company"}</p>
    </section>
  </main>

  <footer>
    <p>&copy; ${new Date().getFullYear()} ${data.name || "Company"}. All rights reserved.</p>
  </footer>
</body>
</html>`;
  },

  generateServicesHTML(data) {
    const servicesHtml = (data.services || [])
      .map(
        (s) => `
      <div class="service">
        <h3>${s.title || "Service"}</h3>
        <p>${s.desc || "Service description"}</p>
      </div>
    `,
      )
      .join("");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Services - ${data.name || "Company"}</title>
  <link rel="stylesheet" href="css/main.css">
</head>
<body>
  <header>
    <h1>${data.name || "Company"}</h1>
    <nav>
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href="services.html">Services</a>
      <a href="contact.html">Contact</a>
    </nav>
  </header>

  <main>
    <section>
      <h2>Our Services</h2>
      <div class="services">
        ${servicesHtml || "<p>No services available</p>"}
      </div>
    </section>
  </main>

  <footer>
    <p>&copy; ${new Date().getFullYear()} ${data.name || "Company"}. All rights reserved.</p>
  </footer>
</body>
</html>`;
  },

  generateContactHTML(data) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact - ${data.name || "Company"}</title>
  <link rel="stylesheet" href="css/main.css">
</head>
<body>
  <header>
    <h1>${data.name || "Company"}</h1>
    <nav>
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href="services.html">Services</a>
      <a href="contact.html">Contact</a>
    </nav>
  </header>

  <main>
    <section class="contact">
      <h2>Contact Us</h2>
      <div class="contact-info">
        ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ""}
        ${data.email ? `<p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>` : ""}
        ${data.address ? `<p><strong>Address:</strong> ${data.address}</p>` : ""}
        ${data.whatsapp ? `<p><strong>WhatsApp:</strong> ${data.whatsapp}</p>` : ""}
        ${data.facebook ? `<p><a href="${data.facebook}" target="_blank">Facebook</a></p>` : ""}
        ${data.instagram ? `<p><a href="${data.instagram}" target="_blank">Instagram</a></p>` : ""}
      </div>
    </section>
  </main>

  <footer>
    <p>&copy; ${new Date().getFullYear()} ${data.name || "Company"}. All rights reserved.</p>
  </footer>
</body>
</html>`;
  },

  generateCSS() {
    return `/* ===================================
   Generated Website Stylesheet
   =================================== */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Cairo', Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background: #f8f9fa;
}

header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 15px;
}

header h1 {
  font-size: 2.5rem;
  margin: 0;
}

nav {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

nav a {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background 0.3s;
}

nav a:hover {
  background: rgba(255, 255, 255, 0.2);
}

main {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

section {
  margin-bottom: 40px;
}

section h2 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
}

.images {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 20px;
}

.images img {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.images img:hover {
  transform: scale(1.05);
}

.services {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.service {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.service:hover {
  transform: translateY(-5px);
}

.service h3 {
  color: #667eea;
  margin-bottom: 10px;
}

.contact-info {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.contact-info p {
  margin-bottom: 15px;
}

.contact-info a {
  color: #667eea;
  text-decoration: none;
}

.contact-info a:hover {
  text-decoration: underline;
}

footer {
  background: #333;
  color: white;
  padding: 20px;
  text-align: center;
  margin-top: 40px;
}

@media (max-width: 768px) {
  header h1 {
    font-size: 1.8rem;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
  }

  nav {
    justify-content: center;
  }

  main {
    margin: 20px auto;
  }

  section h2 {
    font-size: 1.5rem;
  }

  .services {
    grid-template-columns: 1fr;
  }
}`;
  },

  generateMainJS() {
    return `/**
 * Generated Website - Main JavaScript
 */

console.log('Website loaded successfully');

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Add active class to current nav link
document.querySelectorAll('nav a').forEach(link => {
  if (link.href === window.location.href) {
    link.style.background = 'rgba(255, 255, 255, 0.3)';
  }
});`;
  },
};

// ============================================
// AUTHENTICATION
// ============================================

const AuthManager = {
  async handleAuthStateChange() {
    UI.showLoader();

    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        // User not logged in, show login page
        AppState.setAdmin(false);
        this.showLoginPage();
      } else {
        // Determine admin rights by email
        const email = (user.email || "").toLowerCase();
        const isAdmin = ADMIN_EMAILS.includes(email);
        AppState.setAdmin(isAdmin);

        // User logged in, show main app
        this.hideLoginPage();
        await this.initializeApp();
      }
    });
  },

  showLoginPage() {
    const loginPage = document.getElementById("loginPage");
    const mainApp = document.getElementById("mainApp");
    if (loginPage) loginPage.style.display = "flex";
    if (mainApp) mainApp.style.display = "none";

    // Setup login form handler if not already done
    const loginForm = document.getElementById("loginForm");
    if (loginForm && !loginForm._handlerAttached) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleLoginSubmit();
      });
      loginForm._handlerAttached = true;
    }

    UI.hideLoader();
  },

  hideLoginPage() {
    const loginPage = document.getElementById("loginPage");
    const mainApp = document.getElementById("mainApp");
    if (loginPage) loginPage.style.display = "none";
    if (mainApp) mainApp.style.display = "flex";
  },

  async handleLoginSubmit() {
    const email = document.getElementById("loginEmail")?.value || "";
    const password = document.getElementById("loginPassword")?.value || "";
    const loginError = document.getElementById("loginError");
    const loginLoading = document.getElementById("loginLoading");

    if (!email || !password) {
      if (loginError) {
        loginError.textContent = "Please enter email and password";
        loginError.style.display = "block";
      }
      return;
    }

    if (loginLoading) loginLoading.style.display = "flex";
    if (loginError) loginError.style.display = "none";

    try {
      await auth.signInWithEmailAndPassword(email, password);
      // If successful, hide login form and show app
      if (loginLoading) loginLoading.style.display = "none";
      this.hideLoginPage();
      await this.initializeApp();
    } catch (error) {
      if (loginLoading) loginLoading.style.display = "none";
      if (loginError) {
        loginError.textContent = error.message || "Login failed";
        loginError.style.display = "block";
      }
      UI.showToast(`Login failed: ${error.message}`, "error");
    }
  },

  setupLogout() {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn && !logoutBtn._handlerAttached) {
      logoutBtn.addEventListener("click", async () => {
        await auth.signOut();
        // Will trigger the auth state change listener
      });
      logoutBtn._handlerAttached = true;
    }
  },

  initializeDatePicker() {
    const dateRangePicker = document.getElementById("dateRangePicker");
    const dateRangeDisplay = document.getElementById("dateRangeDisplay");

    if (!dateRangePicker) {
      console.error("Date range picker element not found!");
      return;
    }

    if (typeof flatpickr === "undefined") {
      console.error("Flatpickr library not loaded!");
      // Try to load it dynamically
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.js";
      script.onload = () => {
        this.initializeFlatpickrInstance(dateRangePicker, dateRangeDisplay);
      };
      script.onerror = () => console.error("Failed to load Flatpickr");
      document.head.appendChild(script);
      return;
    }

    this.initializeFlatpickrInstance(dateRangePicker, dateRangeDisplay);
  },

  initializeFlatpickrInstance(dateRangePicker, dateRangeDisplay) {
    try {
      const fp = flatpickr(dateRangePicker, {
        mode: "range",
        dateFormat: "Y-m-d",
        altInput: false, // Changed to false to simplify clearing
        placeholder: "Select date range...",
        onChange: (selectedDates, dateStr, instance) => {
          if (selectedDates.length === 2) {
            const fromDate = instance.formatDate(selectedDates[0], "Y-m-d");
            const toDate = instance.formatDate(selectedDates[1], "Y-m-d");
            AppState.setDateRangeFilter(fromDate, toDate);
            Renderer.renderClients();

            // Update display
            const fromFormatted = selectedDates[0].toLocaleDateString();
            const toFormatted = selectedDates[1].toLocaleDateString();
            dateRangeDisplay.textContent = `${fromFormatted} - ${toFormatted}`;
            dateRangeDisplay.style.display = "block";

            UI.showToast("Schedule date filter applied", "success");
          } else if (selectedDates.length === 0) {
            // The picker already cleared, avoid recursion
            AuthManager.clearDateFilter(true);
          }
        },
        onClose: (selectedDates, dateStr, instance) => {
          if (selectedDates.length < 2) {
            // Prevent double-clear loops by only clearing once
            AuthManager.clearDateFilter(true);
          }
        },
      });

      // Ensure the instance is accessible
      dateRangePicker._flatpickr = fp;
    } catch (error) {
      console.error("Error creating Flatpickr instance:", error);
    }
  },

  clearDateFilter(skipPickerClear = false) {
    const dateRangePicker = document.getElementById("dateRangePicker");
    const dateRangeDisplay = document.getElementById("dateRangeDisplay");

    // Clear Flatpickr safely (بدون loop)
    if (!skipPickerClear && dateRangePicker?._flatpickr) {
      dateRangePicker._flatpickr.clear();
    }

    // Clear input manually (احتياط)
    if (dateRangePicker) {
      dateRangePicker.value = "";
    }

    // Clear alt input (لو موجود)
    const altInput = document.querySelector('input[name="date_range_alt"]');
    if (altInput) {
      altInput.value = "";
    }

    // Hide display
    if (dateRangeDisplay) {
      dateRangeDisplay.style.display = "none";
      dateRangeDisplay.textContent = "";
    }

    // Reset state
    AppState.setDateRangeFilter(null, null);
    AppState.setCurrentFilter("All");

    // Reset active filter button safely
    const buttons = document.querySelectorAll(
      ".filters .filter-btn:not(.secondary)",
    );
    buttons.forEach((btn) => {
      btn.classList.remove("active");
      btn.setAttribute("aria-pressed", "false");
    });

    const firstBtn = document.querySelector(
      ".filters .filter-btn:not(.secondary)",
    );
    if (firstBtn) {
      firstBtn.classList.add("active");
      firstBtn.setAttribute("aria-pressed", "true");
    }

    // Render مرة وحدة فقط (مهم للأداء)
    Renderer.renderClients();

    UI.showToast("Filters cleared", "success");
  },

  async initializeApp() {
    try {
      PerformanceMonitor.startMark("app-initialize");

      ClientManager.setupRealtimeListener();
      Renderer.setupFilterButtons();
      Renderer.setupSearch();
      Renderer.setupFileInput();
      Renderer.setupModalButtons();

      // Setup logout button and logo upload
      this.setupLogout();
      ImageManager.setupLogoUpload();

      // Lazy load date picker only when needed
      this.initializeDatePickerLazy();

      UI.hideLoader();

      PerformanceMonitor.endMark("app-initialize");

      // Log performance metrics in development
      if (
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1"
      ) {
        console.log("Performance Metrics:", PerformanceMonitor.getMetrics());
      }
    } catch (error) {
      console.error("Initialization error:", error);
      UI.showToast("Initialization failed", "error");
    }
  },

  initializeDatePickerLazy() {
    // Load Flatpickr CSS and JS only when date picker is actually used
    const dateRangePicker = document.getElementById("dateRangePicker");
    if (dateRangePicker) {
      // Load CSS
      const cssLink = document.createElement("link");
      cssLink.rel = "stylesheet";
      cssLink.href =
        "https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css";
      document.head.appendChild(cssLink);

      // Load JS and initialize
      if (window.loadFlatpickr) {
        window.loadFlatpickr();
        // Wait for script to load then initialize
        const checkFlatpickr = () => {
          if (window.flatpickr) {
            this.initializeFlatpickrInstance(
              dateRangePicker,
              document.getElementById("dateRangeDisplay"),
            );
          } else {
            setTimeout(checkFlatpickr, 50);
          }
        };
        checkFlatpickr();
      }
    }
  },
};

// ============================================
// PERFORMANCE MONITORING & OPTIMIZATION
// ============================================

const PerformanceMonitor = {
  marks: new Map(),
  measures: [],

  startMark(name) {
    if (window.performance && window.performance.mark) {
      performance.mark(name);
      this.marks.set(name, performance.now());
    }
  },

  endMark(name) {
    if (window.performance && window.performance.mark && this.marks.has(name)) {
      const startTime = this.marks.get(name);
      const duration = performance.now() - startTime;
      if (window.performance.measure) {
        performance.mark(`${name}-end`);
        performance.measure(name, name, `${name}-end`);
      }
      this.measures.push({ name, duration, timestamp: Date.now() });
      this.marks.delete(name);
      return duration;
    }
    return 0;
  },

  getMetrics() {
    return {
      measures: this.measures,
      memory:
        window.performance && window.performance.memory
          ? {
              used: window.performance.memory.usedJSHeapSize,
              total: window.performance.memory.totalJSHeapSize,
              limit: window.performance.memory.jsHeapSizeLimit,
            }
          : null,
    };
  },

  // Memory cleanup
  cleanup() {
    this.marks.clear();
    this.measures.length = 0;
  },
};

// ============================================
// INITIALIZATION - HIGHLY OPTIMIZED
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  PerformanceMonitor.startMark("app-init");

  // Initialize phone inputs
  updateRemoveButtons();

  // Use requestIdleCallback for non-critical initialization
  if (window.requestIdleCallback) {
    requestIdleCallback(
      () => {
        AuthManager.handleAuthStateChange();
      },
      { timeout: 2000 },
    );
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      AuthManager.handleAuthStateChange();
    }, 0);
  }

  PerformanceMonitor.endMark("app-init");

  // Initialize tooltip manager
  TooltipManager.initialize();
});

// ============================================
// TOOLTIP MANAGER - CONTEXTUAL FIELD HELP
// ============================================

const TooltipManager = {
  isTouch: false,

  initialize() {
    // Detect if device supports touch
    this.isTouch =
      window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
      navigator.maxTouchPoints > 0;

    // Setup help icon handlers
    const helpIcons = document.querySelectorAll(".help-icon");
    helpIcons.forEach((icon) => {
      if (this.isTouch) {
        // Mobile: tap to toggle tooltip
        icon.addEventListener("click", (e) => {
          e.stopPropagation();
          this.toggleTooltip(icon);
        });
        // Close tooltip when clicking outside
        document.addEventListener("click", (e) => {
          if (!e.target.closest(".help-icon")) {
            helpIcons.forEach((i) => i.classList.remove("active"));
          }
        });
      } else {
        // Desktop: show/hide on hover already handled by CSS
        // Add focusable with tab key for accessibility
        icon.setAttribute("tabindex", "0");
        icon.setAttribute("role", "button");
        icon.setAttribute(
          "aria-label",
          `Help: ${icon.getAttribute("data-tooltip")}`,
        );
      }
    });
  },

  toggleTooltip(icon) {
    // Close all other tooltips
    document.querySelectorAll(".help-icon").forEach((other) => {
      if (other !== icon) {
        other.classList.remove("active");
      }
    });

    // Toggle current tooltip
    icon.classList.toggle("active");
  },

  cleanup() {
    document.querySelectorAll(".help-icon").forEach((icon) => {
      icon.classList.remove("active");
    });
  },
};

// ============================================
// PHONE NUMBERS MANAGEMENT
// ============================================

function addPhoneNumber() {
  const phoneContainer = document.getElementById("phoneContainer");
  const phoneGroups = phoneContainer.querySelectorAll(".phone-input-group");

  if (phoneGroups.length >= 5) {
    UI.showToast("Maximum 5 phone numbers allowed", "warning");
    return;
  }

  const phoneGroup = document.createElement("div");
  phoneGroup.className = "phone-input-group";
  phoneGroup.innerHTML = `
    <input type="tel" class="phone-input" placeholder="Enter phone number" aria-label="Phone number">
    <button type="button" class="remove-phone-btn" onclick="removePhoneNumber(this)">
      <i class="fas fa-times"></i>
    </button>
  `;

  phoneContainer.appendChild(phoneGroup);
  updateRemoveButtons();
}

function removePhoneNumber(button) {
  button.parentElement.remove();
  updateRemoveButtons();
}

function updateRemoveButtons() {
  const phoneGroups = document.querySelectorAll(".phone-input-group");
  phoneGroups.forEach((group, index) => {
    const removeBtn = group.querySelector(".remove-phone-btn");
    if (phoneGroups.length > 1) {
      removeBtn.style.display = "flex";
    } else {
      removeBtn.style.display = "none";
    }
  });
}

// ============================================
// GOOGLE MAPS PREVIEW
// ============================================

function updateMapPreview() {
  const mapLink = document.getElementById("googleMapsLink").value;
  const mapPreview = document.getElementById("mapPreview");
  const mapIframe = document.getElementById("mapIframe");

  if (mapLink && mapLink.includes("google.com/maps")) {
    // Extract embed URL from share link
    let embedUrl = mapLink;
    if (mapLink.includes("/place/")) {
      const placeMatch = mapLink.match(/\/place\/([^\/]+)/);
      if (placeMatch) {
        embedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dO6y8nRYPzQa0&q=${encodeURIComponent(placeMatch[1])}`;
      }
    } else if (mapLink.includes("@")) {
      // Handle coordinate links
      embedUrl = mapLink.replace("/maps/", "/maps/embed");
    }

    mapIframe.src = embedUrl;
    mapPreview.style.display = "block";
  } else {
    mapPreview.style.display = "none";
    mapIframe.src = "";
  }
}

// ============================================
// CLEAN FILE NAMING
// ============================================

function cleanFileName(fileName) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  if (AppState.unsubscribe) {
    AppState.unsubscribe();
  }
  AppState.cleanup();
  PerformanceMonitor.cleanup();
  UI._eventDelegates.clear();
});
