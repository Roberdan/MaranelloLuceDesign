(function () {
  function appendSvg(host, svg) {
    var doc;
    var root;
    if (!svg) return;
    try {
      doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
      root = doc && doc.documentElement;
      if (!root || root.nodeName.toLowerCase() !== 'svg') return;
      host.appendChild(document.importNode(root, true));
    } catch (_error) {}
  }

  function createHeaderResponsiveFilterBoard(options) {
    var searchHost = null;
    var trigger = null;
    var board = null;

    function close() {
      if (!board || board.hidden) return;
      board.hidden = true;
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    }

    function position() {
      if (!board || !searchHost || board.hidden) return;
      var rect = searchHost.getBoundingClientRect();
      var width = Math.min(980, window.innerWidth - 48);
      board.style.width = width + 'px';
      board.style.left = Math.max(24, Math.min(rect.left, window.innerWidth - width - 24)) + 'px';
      board.style.top = (rect.bottom + 10) + 'px';
    }

    function render() {
      if (!board) return;
      var columns = board.querySelector('.filter-board__columns');
      var filters = options.getFilters();
      columns.textContent = '';
      options.groups.forEach(function (group) {
        var column = document.createElement('div');
        column.className = 'filter-board__col';
        var title = document.createElement('h3');
        title.className = 'filter-board__title';
        title.textContent = group.label;
        column.appendChild(title);
        group.options.forEach(function (option) {
          var button = document.createElement('button');
          var selected = (filters[group.id] || ['all']).indexOf(option.id) !== -1;
          button.type = 'button';
          button.className = 'filter-board__item' + (selected ? ' filter-board__item--selected' : '');
          if (!selected && option.id !== 'all') button.classList.add('filter-board__item--dim');
          button.addEventListener('click', function () {
            options.onSelect(group.id, options.nextValues(group, option.id));
            render();
          });
          if (option.tone) {
            var dot = document.createElement('span');
            dot.className = 'filter-board__dot';
            dot.setAttribute('data-tone', option.tone);
            button.appendChild(dot);
          }
          var label = document.createElement('span');
          label.textContent = option.label;
          button.appendChild(label);
          var count = document.createElement('span');
          count.className = 'filter-board__count';
          count.textContent = String(options.optionCount(group.id, option.id));
          button.appendChild(count);
          var check = document.createElement('span');
          check.className = 'filter-board__check';
          check.textContent = '✓';
          button.appendChild(check);
          column.appendChild(button);
        });
        columns.appendChild(column);
      });
    }

    function ensureBoard() {
      if (board) return;
      board = document.createElement('div');
      board.id = 'legacy-filter-board';
      board.hidden = true;
      board.innerHTML = '<div class="filter-board__columns"></div><div class="filter-board__footer"><button type="button" class="filter-board__save">Save as default</button><button type="button" class="filter-board__clear">Clear</button></div>';
      document.body.appendChild(board);
      board.querySelector('.filter-board__save').addEventListener('click', function () {
        options.onSave();
        close();
      });
      board.querySelector('.filter-board__clear').addEventListener('click', function () {
        options.onClear();
        render();
        close();
      });
      document.addEventListener('click', function (event) {
        var target = event.target;
        if (!board || board.hidden) return;
        if (board.contains(target) || (trigger && trigger.contains(target))) return;
        close();
      });
      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') close();
      });
      window.addEventListener('resize', position);
    }

    function open() {
      ensureBoard();
      render();
      board.hidden = false;
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
      position();
    }

    function mount(host) {
      var input;
      var sep;
      if (!host || host.querySelector('.shell-filter-trigger')) return;
      searchHost = host;
      input = host.querySelector('.mn-header-shell__search-input');
      if (!input) return;
      trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'shell-filter-trigger';
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.setAttribute('aria-expanded', 'false');
      var label = document.createElement('span');
      label.textContent = options.label;
      trigger.appendChild(label);
      appendSvg(trigger, options.chevronSvg);
      trigger.addEventListener('click', function () {
        if (board && !board.hidden) close();
        else open();
      });
      sep = document.createElement('span');
      sep.className = 'shell-filter-sep';
      sep.textContent = '/';
      host.insertBefore(sep, input);
      host.insertBefore(trigger, sep);
    }

    return { mount: mount, render: render, close: close };
  }

  window.createHeaderResponsiveFilterBoard = createHeaderResponsiveFilterBoard;
})();
