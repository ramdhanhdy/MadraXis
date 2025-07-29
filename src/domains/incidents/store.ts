import { create } from 'zustand';
import { IncidentWithDetails, IncidentStats } from './types';

interface IncidentState {
  // Current selected incident
  selectedIncident: IncidentWithDetails | null;
  setSelectedIncident: (incident: IncidentWithDetails | null) => void;

  // Incidents list
  incidents: IncidentWithDetails[];
  setIncidents: (incidents: IncidentWithDetails[]) => void;
  addIncident: (incident: IncidentWithDetails) => void;
  updateIncident: (incidentId: number, updates: Partial<IncidentWithDetails>) => void;
  removeIncident: (incidentId: number) => void;

  // Statistics
  stats: IncidentStats | null;
  setStats: (stats: IncidentStats) => void;

  // Selected incidents for bulk operations
  selectedIncidentIds: number[];
  setSelectedIncidentIds: (incidentIds: number[]) => void;
  toggleIncidentSelection: (incidentId: number) => void;
  clearSelectedIncidents: () => void;

  // UI state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;

  // Filters and search
  statusFilter: 'all' | 'open' | 'investigating' | 'resolved' | 'closed';
  setStatusFilter: (status: 'all' | 'open' | 'investigating' | 'resolved' | 'closed') => void;
  typeFilter: 'all' | 'disciplinary' | 'academic' | 'health' | 'safety' | 'other';
  setTypeFilter: (type: 'all' | 'disciplinary' | 'academic' | 'health' | 'safety' | 'other') => void;
  severityFilter: 'all' | 'low' | 'medium' | 'high' | 'critical';
  setSeverityFilter: (severity: 'all' | 'low' | 'medium' | 'high' | 'critical') => void;
  dateFromFilter: string | null;
  setDateFromFilter: (date: string | null) => void;
  dateToFilter: string | null;
  setDateToFilter: (date: string | null) => void;

  // Pagination
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  setTotalPages: (pages: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;
  totalItems: number;
  setTotalItems: (items: number) => void;

  // Reset functions
  resetIncidentState: () => void;
  resetFilters: () => void;
}

export const useIncidentStore = create<IncidentState>((set, get) => ({
  // Current selected incident
  selectedIncident: null,
  setSelectedIncident: (incident) => set({ selectedIncident: incident }),

  // Incidents list
  incidents: [],
  setIncidents: (incidents) => set({ incidents }),
  addIncident: (incident) => set((state) => ({ 
    incidents: [incident, ...state.incidents] 
  })),
  updateIncident: (incidentId, updates) => set((state) => ({
    incidents: state.incidents.map(incident => 
      incident.id === incidentId ? { ...incident, ...updates } : incident
    ),
    selectedIncident: state.selectedIncident?.id === incidentId 
      ? { ...state.selectedIncident, ...updates }
      : state.selectedIncident
  })),
  removeIncident: (incidentId) => set((state) => ({
    incidents: state.incidents.filter(incident => incident.id !== incidentId),
    selectedIncident: state.selectedIncident?.id === incidentId ? null : state.selectedIncident,
    selectedIncidentIds: state.selectedIncidentIds.filter(id => id !== incidentId)
  })),

  // Statistics
  stats: null,
  setStats: (stats) => set({ stats }),

  // Selected incidents for bulk operations
  selectedIncidentIds: [],
  setSelectedIncidentIds: (incidentIds) => set({ selectedIncidentIds: incidentIds }),
  toggleIncidentSelection: (incidentId) => set((state) => ({
    selectedIncidentIds: state.selectedIncidentIds.includes(incidentId)
      ? state.selectedIncidentIds.filter(id => id !== incidentId)
      : [...state.selectedIncidentIds, incidentId]
  })),
  clearSelectedIncidents: () => set({ selectedIncidentIds: [] }),

  // UI state
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  error: null,
  setError: (error) => set({ error }),

  // Filters and search
  statusFilter: 'all',
  setStatusFilter: (status) => set({ statusFilter: status }),
  typeFilter: 'all',
  setTypeFilter: (type) => set({ typeFilter: type }),
  severityFilter: 'all',
  setSeverityFilter: (severity) => set({ severityFilter: severity }),
  dateFromFilter: null,
  setDateFromFilter: (date) => set({ dateFromFilter: date }),
  dateToFilter: null,
  setDateToFilter: (date) => set({ dateToFilter: date }),

  // Pagination
  currentPage: 1,
  setCurrentPage: (page) => set({ currentPage: page }),
  totalPages: 1,
  setTotalPages: (pages) => set({ totalPages: pages }),
  itemsPerPage: 10,
  setItemsPerPage: (items) => set({ itemsPerPage: items }),
  totalItems: 0,
  setTotalItems: (items) => set({ totalItems: items }),

  // Reset functions
  resetIncidentState: () => set({
    selectedIncident: null,
    incidents: [],
    stats: null,
    selectedIncidentIds: [],
    statusFilter: 'all',
    typeFilter: 'all',
    severityFilter: 'all',
    dateFromFilter: null,
    dateToFilter: null,
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    error: null
  }),
  resetFilters: () => set({
    statusFilter: 'all',
    typeFilter: 'all',
    severityFilter: 'all',
    dateFromFilter: null,
    dateToFilter: null,
    currentPage: 1
  })
}));

// Selectors for computed values
export const useIncidentSelectors = () => {
  const store = useIncidentStore();
  
  return {
    // Filtered incidents based on current filters
    filteredIncidents: store.incidents.filter(incident => {
      const matchesStatus = store.statusFilter === 'all' || 
        incident.status === store.statusFilter;
      const matchesType = store.typeFilter === 'all' || 
        incident.incident_type === store.typeFilter;
      const matchesSeverity = store.severityFilter === 'all' || 
        incident.severity === store.severityFilter;
      
      let matchesDateRange = true;
      if (store.dateFromFilter) {
        matchesDateRange = matchesDateRange && 
          new Date(incident.created_at) >= new Date(store.dateFromFilter);
      }
      if (store.dateToFilter) {
        matchesDateRange = matchesDateRange && 
          new Date(incident.created_at) <= new Date(store.dateToFilter);
      }
      
      return matchesStatus && matchesType && matchesSeverity && matchesDateRange;
    }),

    // Selected incidents count
    selectedIncidentsCount: store.selectedIncidentIds.length,

    // Has selected incident
    hasSelectedIncident: !!store.selectedIncident,

    // Is any incident selected for bulk operations
    hasSelectedIncidents: store.selectedIncidentIds.length > 0,

    // Current filter summary
    activeFiltersCount: [
      store.statusFilter !== 'all',
      store.typeFilter !== 'all',
      store.severityFilter !== 'all',
      !!store.dateFromFilter,
      !!store.dateToFilter
    ].filter(Boolean).length,

    // Pagination info
    paginationInfo: {
      currentPage: store.currentPage,
      totalPages: store.totalPages,
      itemsPerPage: store.itemsPerPage,
      totalItems: store.totalItems,
      hasNextPage: store.currentPage < store.totalPages,
      hasPrevPage: store.currentPage > 1
    },

    // Quick stats from current incidents
    quickStats: {
      total: store.incidents.length,
      open: store.incidents.filter(i => i.status === 'open').length,
      investigating: store.incidents.filter(i => i.status === 'investigating').length,
      resolved: store.incidents.filter(i => i.status === 'resolved').length,
      closed: store.incidents.filter(i => i.status === 'closed').length,
      critical: store.incidents.filter(i => i.severity === 'critical').length,
      high: store.incidents.filter(i => i.severity === 'high').length
    }
  };
};

// Actions for common operations
export const useIncidentActions = () => {
  const store = useIncidentStore();

  return {
    // Select all visible incidents
    selectAllIncidents: () => {
      const incidentIds = store.incidents.map(i => i.id);
      store.setSelectedIncidentIds(incidentIds);
    },

    // Select incidents by status
    selectIncidentsByStatus: (status: string) => {
      const incidentIds = store.incidents
        .filter(i => i.status === status)
        .map(i => i.id);
      store.setSelectedIncidentIds(incidentIds);
    },

    // Select incidents by severity
    selectIncidentsBySeverity: (severity: string) => {
      const incidentIds = store.incidents
        .filter(i => i.severity === severity)
        .map(i => i.id);
      store.setSelectedIncidentIds(incidentIds);
    },

    // Clear all selections and reset to first page
    resetFiltersAndPagination: () => {
      store.resetFilters();
      store.clearSelectedIncidents();
    },

    // Update pagination based on search results
    updatePaginationFromResults: (total: number, page: number, limit: number) => {
      const totalPages = Math.ceil(total / limit);
      store.setTotalItems(total);
      store.setCurrentPage(page);
      store.setTotalPages(totalPages);
      store.setItemsPerPage(limit);
    },

    // Mark incident as resolved
    markAsResolved: (incidentId: number) => {
      store.updateIncident(incidentId, { 
        status: 'resolved',
        resolved_at: new Date().toISOString()
      });
    },

    // Mark incident as investigating
    markAsInvestigating: (incidentId: number) => {
      store.updateIncident(incidentId, { status: 'investigating' });
    }
  };
};
