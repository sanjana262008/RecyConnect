import { UserProfile, WasteListing, Enquiry } from '../types';
import { DEFAULT_DEMO_USER, INITIAL_LISTINGS, INITIAL_ENQUIRIES } from '../data/initialData';

const USER_KEY = 'recyconnect_user';
const LISTINGS_KEY = 'recyconnect_listings';
const ENQUIRIES_KEY = 'recyconnect_enquiries';
const SESSION_KEY = 'recyconnect_auth_session';

export function getStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read user from localStorage', e);
    return null;
  }
}

export function saveStoredUser(user: UserProfile | null): void {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch (e) {
    console.error('Failed to save user to localStorage', e);
  }
}

export function isSessionActive(): boolean {
  try {
    return localStorage.getItem(SESSION_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setSessionActive(active: boolean): void {
  try {
    if (active) {
      localStorage.setItem(SESSION_KEY, 'true');
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch (e) {
    console.error('Failed to set session active', e);
  }
}

export function getStoredListings(): WasteListing[] {
  try {
    const raw = localStorage.getItem(LISTINGS_KEY);
    if (!raw) {
      // First time initialize with initial demo sample listings
      saveStoredListings(INITIAL_LISTINGS);
      return INITIAL_LISTINGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read listings from localStorage', e);
    return INITIAL_LISTINGS;
  }
}

export function saveStoredListings(listings: WasteListing[]): void {
  try {
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
  } catch (e) {
    console.error('Failed to save listings to localStorage', e);
  }
}

export function getStoredEnquiries(): Enquiry[] {
  try {
    const raw = localStorage.getItem(ENQUIRIES_KEY);
    if (!raw) {
      saveStoredEnquiries(INITIAL_ENQUIRIES);
      return INITIAL_ENQUIRIES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read enquiries from localStorage', e);
    return INITIAL_ENQUIRIES;
  }
}

export function saveStoredEnquiries(enquiries: Enquiry[]): void {
  try {
    localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(enquiries));
  } catch (e) {
    console.error('Failed to save enquiries to localStorage', e);
  }
}

export function resetDemoData(): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(DEFAULT_DEMO_USER));
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(INITIAL_LISTINGS));
    localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(INITIAL_ENQUIRIES));
    localStorage.setItem(SESSION_KEY, 'true');
  } catch (e) {
    console.error('Failed to reset demo data in localStorage', e);
  }
}
