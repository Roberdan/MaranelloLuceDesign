(function () {
  var M = window.Maranello;
  if (!M || !M.icons) return;

  var storageKey = 'mn-header-shell-defaults';
  var records = [
    { id: 'ENG-104', title: 'Autonomous Networks', status: 'watch', region: 'na', priority: 'p1' },
    { id: 'ENG-113', title: 'Claims Routing Core', status: 'active', region: 'emea', priority: 'p1' },
    { id: 'ENG-127', title: 'Agent Copilot Rollout', status: 'active', region: 'na', priority: 'p2' },
    { id: 'ENG-154', title: 'Topology Audit', status: 'blocked', region: 'emea', priority: 'p3' },
  ];
  var filterGroups = [
    { id: 'status', label: 'Status', multi: true, options: [{ id: 'all', label: 'All' }, { id: 'active', label: 'Active', tone: 'gold' }, { id: 'watch', label: 'Watch', tone: 'blue' }, { id: 'blocked', label: 'Blocked', tone: 'purple' }] },
    { id: 'region', label: 'Region', options: [{ id: 'all', label: 'All' }, { id: 'na', label: 'NA' }, { id: 'emea', label: 'EMEA' }] },
    { id: 'priority', label: 'Priority', options: [{ id: 'all', label: 'All' }, { id: 'p1', label: 'P1' }, { id: 'p2', label: 'P2' }, { id: 'p3', label: 'P3' }] },
  ];
  var viewIds = ['gantt', 'table', 'heatmap', 'map', 'network', 'copilot'];
  var state = { view: 'gantt', query: '', filters: { status: ['all'], region: ['all'], priority: ['all'] } };
  var navbar = document.getElementById('navbar');
  var headerCtrl = null;
  var brandLogo = '../src/assets/favicon.svg';
  var searchSection = {
    type: 'search',
    placeholder: 'Filter by name, owner, account...',
    shortcut: '⌘K',
    filterButtonLabel: 'Filters',
    filters: filterGroups,
  };

  if (!navbar) return;

  function icon(name) {
    if (!M.icons || typeof M.icons[name] !== 'function') return '';
    return M.icons[name]();
  }

  function setClass(node, name, on) {
    if (!node) return;
    if (on) node.classList.add(name);
    else node.classList.remove(name);
  }

  function restoreDefaults() {
    try {
      var saved = localStorage.getItem(storageKey);
      if (!saved) return;
      var parsed = JSON.parse(saved);
      if (!parsed || typeof parsed !== 'object') return;
      filterGroups.forEach(function (group) {
        if (Array.isArray(parsed[group.id]) && parsed[group.id].length) state.filters[group.id] = parsed[group.id].slice();
      });
    } catch (_error) {}
  }

  function matches(value, selected) {
    return selected[0] === 'all' || selected.indexOf(value) !== -1;
  }

  function filteredRecords() {
    var query = state.query.toLowerCase().trim();
    return records.filter(function (item) {
      if (!matches(item.status, state.filters.status)) return false;
      if (!matches(item.region, state.filters.region)) return false;
      if (!matches(item.priority, state.filters.priority)) return false;
      if (!query) return true;
      return (item.id + ' ' + item.title).toLowerCase().indexOf(query) !== -1;
    });
  }

  function syncViewButtons() {
    viewIds.forEach(function (id) {
      var button = document.querySelector('[data-header-shell-action-id="' + id + '"]');
      setClass(button, 'mn-header-shell__action--active', state.view === id);
    });
  }

  function syncHeaderFilters() {
    if (!headerCtrl) return;
    filterGroups.forEach(function (group) {
      headerCtrl.setFilter(group.id, state.filters[group.id].slice());
    });
  }

  function nextFilterValues(group, optionId) {
    if (!group.multi) return [optionId];
    if (optionId === 'all') return ['all'];
    var current = state.filters[group.id] || ['all'];
    var next = current[0] === 'all' ? [] : current.slice();
    var index = next.indexOf(optionId);
    if (index === -1) next.push(optionId);
    else next.splice(index, 1);
    return next.length ? next : ['all'];
  }

  var filterBoard = window.createHeaderResponsiveFilterBoard
    ? window.createHeaderResponsiveFilterBoard({
      groups: filterGroups,
      label: searchSection.filterButtonLabel || 'Filters',
      chevronSvg: icon('chevronDown'),
      getFilters: function () { return state.filters; },
      optionCount: function (groupId, optionId) {
        var list = filteredRecords();
        if (optionId === 'all') return list.length;
        var count = 0;
        list.forEach(function (item) { if (item[groupId] === optionId) count += 1; });
        return count;
      },
      nextValues: nextFilterValues,
      onSelect: function (groupId, values) {
        if (headerCtrl) headerCtrl.setFilter(groupId, values);
      },
      onSave: function () {
        try { localStorage.setItem(storageKey, JSON.stringify(state.filters)); } catch (_error) {}
      },
      onClear: function () {
        state.filters = { status: ['all'], region: ['all'], priority: ['all'] };
        syncHeaderFilters();
      },
    })
    : null;

  function handleAction(payload) {
    if (viewIds.indexOf(payload.id) !== -1) state.view = payload.id;
    syncViewButtons();
  }

  function mountHeader() {
    var headerHost = document.createElement('mn-header-shell');
    headerHost.config = {
      ariaLabel: 'Responsive shell navigation',
      sections: [
        { type: 'brand', label: 'Maranello Luce', logoSrc: brandLogo, logoAlt: 'Maranello Luce mark', href: './index.html' },
        {
          type: 'actions',
          role: 'pre',
          presentation: 'segmented',
          items: [
            { id: 'gantt', label: 'Gantt', icon: icon('gantt'), active: true },
            { id: 'table', label: 'Table', icon: icon('table') },
            { id: 'heatmap', label: 'Heatmap', icon: icon('heatmap') },
          ],
        },
        searchSection,
        {
          type: 'actions',
          role: 'post',
          presentation: 'cluster',
          items: [
            { id: 'pipeline', title: 'Pipeline', icon: icon('pipeline') },
            { id: 'strip', title: 'Strip', icon: icon('columns') },
            { id: 'detail', title: 'Detail', icon: icon('panelRight') },
            { id: 'map', title: 'Map', icon: icon('grid') },
            { id: 'network', title: 'Network', icon: icon('network') },
            { id: 'copilot', title: 'Copilot', icon: icon('autopilot') },
          ],
        },
        { type: 'divider' },
        { type: 'theme' },
        { type: 'profile', name: 'Roberdan D.' },
      ],
      callbacks: {
        onAction: handleAction,
        onSearch: function (payload) {
          state.query = payload.query;
          if (filterBoard) filterBoard.render();
        },
        onFilter: function (payload) {
          state.filters[payload.groupId] = payload.values.slice();
          if (filterBoard) filterBoard.render();
        },
      },
    };
    navbar.textContent = '';
    navbar.appendChild(headerHost);
    headerCtrl = headerHost;

    var ready = typeof headerHost.whenReady === 'function'
      ? headerHost.whenReady()
      : Promise.resolve();
    ready.then(function () {
      if (!headerHost.isConnected) return;
      syncViewButtons();
      if (!filterBoard) return;
      filterBoard.mount(headerHost.querySelector('.mn-header-shell__search'));
      syncHeaderFilters();
      filterBoard.render();
    });
  }

  restoreDefaults();
  filteredRecords();
  mountHeader();
})();
