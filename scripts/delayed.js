import { getConfigValue } from '@dropins/tools/lib/aem/configs.js';
import { getUserTokenCookie } from './initializers/index.js';
import { getConsent } from './commerce.js';
import { loadScript } from './aem.js';

async function initAnalytics() {
  try {
    // Load Commerce events SDK and collector
    // only if "analytics" has been added to the config.
    const analyticsConfig = getConfigValue('analytics');

    if (analyticsConfig && getConsent('commerce-collection')) {
      window.adobeDataLayer.push(
        {
          storefrontInstanceContext: {
            baseCurrencyCode: analyticsConfig['base-currency-code'],
            environment: analyticsConfig.environment,
            environmentId: analyticsConfig['environment-id'],
            storeCode: analyticsConfig['store-code'],
            storefrontTemplate: 'EDS',
            storeId: parseInt(analyticsConfig['store-id'], 10),
            storeName: analyticsConfig['store-name'],
            storeUrl: analyticsConfig['store-url'],
            storeViewCode: analyticsConfig['store-view-code'],
            storeViewCurrencyCode: analyticsConfig['base-currency-code'],
            storeViewId: parseInt(analyticsConfig['store-view-id'], 10),
            storeViewName: analyticsConfig['store-view-name'],
            websiteCode: analyticsConfig['website-code'],
            websiteId: parseInt(analyticsConfig['website-id'], 10),
            websiteName: analyticsConfig['website-name'],
            viewId: analyticsConfig['view-id'], // applicable for ACO storefronts
          },
        },
        { eventForwardingContext: { commerce: true, aep: false } },
        {
          shopperContext: {
            shopperId: getUserTokenCookie() ? 'logged-in' : 'guest',
          },
        },
      );

      // Load events SDK and collector
      import('./commerce-events-sdk.js');
      import('./commerce-events-collector.js');
    }
  } catch (error) {
    console.warn('Error initializing analytics', error);
  }
}

if (document.prerendering) {
  document.addEventListener('prerenderingchange', initAnalytics, { once: true });
} else {
  initAnalytics();
}

// const msalConfig = {
//     auth: {
//       clientId: "68e8bc47-96c7-4ab0-bbe0-28ad5771dc32",
//       authority: "https://login.microsoftonline.com/44a6c9d1-014f-4db6-8e72-af6ebeaac182",
//       redirectUri: window.location.origin
//     },
//     cache: { cacheLocation: "localStorage" }
//   };
//   let msalInstance;

// const form = document.querySelector(".auth-sign-in-form__form")
// let div1 = document.querySelector("div")
// let btnDom = `
// <button role="button" type="submit" class="dropin-button dropin-button--medium dropin-button--primary auth-button auth-sign-in-form__button auth-sign-in-form__button--submit">
// <span class="auth-button__text">Sign in 2</span></button>`

// div1.innerHTML = btnDom;
// div1.classList.remove("overlay")
// div1.onclick = async () => {
//   try {
//     console.log("🔐 Initializing MSAL...");

//     // Initialize MSAL first
//     const msal = await initMSAL();

//     console.log("🔐 Attempting Microsoft Sign-In...");

//     const loginResponse = await msal.loginPopup({
//       scopes: ["openid", "profile", "email"]
//     });

//     const account = loginResponse.account;
//     const tokenResponse = await msal.acquireTokenSilent({
//       scopes: ["openid", "profile", "email"],
//       account
//     });

//     const claims = tokenResponse.idTokenClaims;
//     const userInfo = {
//       given_name: claims.given_name,
//       family_name: claims.family_name,
//       email: claims.email,
//       oid: claims.oid,
//       idToken: tokenResponse.idToken.substring(0, 60) + "..."
//     };

//     console.log("✅ Microsoft Login success:", userInfo);

//     // Store user info in localStorage for persistence
//     localStorage.setItem('ms_user_info', JSON.stringify({
//       firstName: claims.given_name,
//       lastName: claims.family_name,
//       email: claims.email
//     }));

//     // Update UI to show user name
//     const loginButton = document.querySelector('.nav-dropdown-button');
//     if (loginButton) {
//       loginButton.textContent = `Hi, ${claims.given_name}`;
//     }

//     // Show authenticated menu
//     const authDropDownMenuList = document.querySelector('.authenticated-user-menu');
//     const authDropinContainer = document.querySelector('#auth-dropin-container');

//     if (authDropDownMenuList) authDropDownMenuList.style.display = 'block';
//     if (authDropinContainer) authDropinContainer.style.display = 'none';

//     // Close the modal/dropdown
//     const modal = document.querySelector('dialog');
//     if (modal) modal.close();

//     const authPanel = document.querySelector('.nav-auth-menu-panel');
//     if (authPanel) {
//       authPanel.classList.remove('nav-tools-panel--show');
//     }

//   } catch (err) {
//     console.error("❌ Microsoft Login error:", err);
//     alert(`Login failed: ${err.message || 'Unknown error occurred'}`);
//   }
// }

// // Function to initialize MSAL (called when needed)
// async function initMSAL() {
//   if (msalInstance) return msalInstance; // Already initialized

//   // Wait for MSAL library to load
//   let attempts = 0;
//   while (typeof window.msal === 'undefined' && attempts < 50) {
//     await new Promise(resolve => setTimeout(resolve, 100));
//     attempts++;
//   }

//   if (typeof window.msal === 'undefined') {
//     console.error("❌ MSAL library failed to load after 5 seconds");
//     throw new Error("MSAL library not available");
//   }

//   try {
//     msalInstance = new window.msal.PublicClientApplication(msalConfig);
//     await msalInstance.initialize();
//     console.log("✅ MSAL initialized successfully");
//     return msalInstance;
//   } catch (error) {
//     console.error("❌ MSAL initialization failed:", error);
//     throw error;
//   }
// }

// form.appendChild(div1)
// add delayed functionality here
