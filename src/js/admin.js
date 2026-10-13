document.addEventListener('DOMContentLoaded', function() {
    // Toggle de módulos
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    const modules = document.querySelectorAll('.module');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase active de todos los links y módulos
            sidebarLinks.forEach(l => l.parentElement.classList.remove('active'));
            modules.forEach(m => m.classList.remove('active'));
            
            // Agregar clase active al link clickeado
            this.parentElement.classList.add('active');
            
            // Mostrar el módulo correspondiente
            const target = this.getAttribute('href');
            document.querySelector(target).classList.add('active');
        });
    });
    
    // Tabs de contabilidad
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // Remover clase active de todos los botones y paneles
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            // Mostrar el panel correspondiente
            tabPanes[index].classList.add('active');
        });
    });
    
    // Menú responsive
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    menuToggle.setAttribute('aria-label', 'Toggle menu');
    
    const adminHeader = document.querySelector('.admin-header');
    adminHeader.prepend(menuToggle);
    
    menuToggle.addEventListener('click', function() {
        document.querySelector('.admin-sidebar').classList.toggle('active');
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.admin-sidebar') && !e.target.closest('.menu-toggle')) {
            document.querySelector('.admin-sidebar').classList.remove('active');
        }
    });
    
    // Simular carga de datos
    function loadModuleData(moduleId) {
        console.log(`Cargando datos para módulo: ${moduleId}`);
        // Aquí irían las llamadas AJAX reales para cada módulo
    }
    
    // Observar cambios en los módulos activos para cargar datos
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                const activeModule = document.querySelector('.module.active');
                if (activeModule) {
                    loadModuleData(activeModule.id);
                }
            }
        });
    });
    
    modules.forEach(module => {
        observer.observe(module, { attributes: true });
    });
    
    // Cargar datos iniciales
    loadModuleData(document.querySelector('.module.active').id);
});

// En admin.js
class AccountingModule {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.sortColumn = 'date';
        this.sortDirection = 'desc';
        this.currentTab = 'cuentas-cobrar';
        this.init();
    }

    init() {
        // Event listeners
        document.querySelectorAll('[data-tab]').forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });

        document.getElementById('nuevoRegistroBtn').addEventListener('click', () => this.openModal());
        document.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
        document.getElementById('accountingForm').addEventListener('submit', (e) => this.saveRecord(e));
        document.getElementById('filterStatus').addEventListener('change', () => this.loadData());
        document.getElementById('searchReceivables').addEventListener('input', () => this.debouncedSearch());
        
        // Paginación
        document.getElementById('prevPage').addEventListener('click', () => this.changePage(-1));
        document.getElementById('nextPage').addEventListener('click', () => this.changePage(1));
        
        // Ordenamiento
        document.querySelectorAll('[data-sort]').forEach(header => {
            header.addEventListener('click', () => this.sortTable(header.dataset.sort));
        });
        
        // Cargar datos iniciales
        this.loadProperties();
        this.loadData();
        
        // Inicializar dropdown
        new Dropdown(document.getElementById('exportDropdown'));
    }

    async loadData() {
        const statusFilter = document.getElementById('filterStatus').value;
        const searchQuery = document.getElementById('searchReceivables').value;
        
        try {
            // Mostrar loader
            document.getElementById('receivablesTable').querySelector('tbody').innerHTML = 
                '<tr><td colspan="6" class="loading-row">Cargando datos...</td></tr>';
            
            // Simular llamada API (en producción sería fetch/axios)
            const response = await this.mockApiCall({
                page: this.currentPage,
                limit: this.itemsPerPage,
                sort: this.sortColumn,
                order: this.sortDirection,
                status: statusFilter,
                search: searchQuery,
                tab: this.currentTab
            });
            
            this.renderTable(response.data);
            this.updatePagination(response.total);
        } catch (error) {
            console.error('Error al cargar datos:', error);
            this.showError('Error al cargar datos. Intente nuevamente.');
        }
    }

    renderTable(data) {
        const tbody = document.getElementById('receivablesTable').querySelector('tbody');
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="no-data">No se encontraron registros</td></tr>';
            return;
        }
        
        let total = 0;
        
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.property}</td>
                <td>${item.concept}</td>
                <td>${new Date(item.date).toLocaleDateString()}</td>
                <td>$${item.amount.toLocaleString()}</td>
                <td><span class="status-badge ${item.status}">${this.getStatusText(item.status)}</span></td>
                <td class="actions">
                    <button class="action-btn view-btn" data-id="${item.id}"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit-btn" data-id="${item.id}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn print-btn" data-id="${item.id}"><i class="fas fa-print"></i></button>
                </td>
            `;
            tbody.appendChild(row);
            total += item.amount;
        });
        
        document.getElementById('totalReceivables').textContent = `$${total.toLocaleString()}`;
        
        // Agregar eventos a los botones
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => this.viewRecord(btn.dataset.id));
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => this.editRecord(btn.dataset.id));
        });
        
        document.querySelectorAll('.print-btn').forEach(btn => {
            btn.addEventListener('click', () => this.printRecord(btn.dataset.id));
        });
    }

    async loadProperties() {
        try {
            // Simular llamada API para obtener propiedades
            const response = await this.mockApiCall({ action: 'getProperties' });
            const select = document.getElementById('accountProperty');
            select.innerHTML = response.data.map(prop => 
                `<option value="${prop.id}">${prop.name}</option>`
            ).join('');
        } catch (error) {
            console.error('Error al cargar propiedades:', error);
        }
    }

    // Más métodos para el módulo...
    // switchTab, openModal, closeModal, saveRecord, viewRecord, editRecord, printRecord, etc.
    
    debouncedSearch = this.debounce(() => this.loadData(), 300);
    
    debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
    
    mockApiCall(params) {
        // Simular llamada API con datos de prueba
        return new Promise((resolve) => {
            setTimeout(() => {
                const data = this.generateMockData(params);
                resolve({ 
                    success: true,
                    data: data.slice((params.page - 1) * params.limit, params.page * params.limit),
                    total: data.length
                });
            }, 500);
        });
    }
    
    generateMockData(params) {
        // Generar datos de prueba según los parámetros
        // Implementación completa en el código final
    }
}

// Inicializar módulo cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('contabilidad')) {
        new AccountingModule();
    }
});

class BillingModule {
    constructor() {
        this.currentPeriod = 'current';
        this.invoiceStatus = 'all';
        this.init();
    }

    init() {
        // Event listeners
        document.getElementById('billingPeriod').addEventListener('change', (e) => {
            this.currentPeriod = e.target.value;
            this.toggleCustomDates();
            this.loadInvoices();
        });
        
        document.getElementById('applyDates').addEventListener('click', () => this.loadInvoices());
        document.getElementById('invoiceStatusFilter').addEventListener('change', (e) => {
            this.invoiceStatus = e.target.value;
            this.loadInvoices();
        });
        
        document.getElementById('generateInvoicesBtn').addEventListener('click', () => this.openGenerationModal());
        document.getElementById('sendRemindersBtn').addEventListener('click', () => this.sendPaymentReminders());
        document.getElementById('confirmGeneration').addEventListener('click', () => this.generateInvoices());
        
        // Cargar datos iniciales
        this.loadInvoices();
        this.setupDatePickers();
    }

    async loadInvoices() {
        try {
            const params = {
                period: this.currentPeriod,
                status: this.invoiceStatus,
                startDate: this.currentPeriod === 'custom' ? document.getElementById('startDate').value : null,
                endDate: this.currentPeriod === 'custom' ? document.getElementById('endDate').value : null
            };
            
            // Mostrar loading
            document.getElementById('invoicesTable').querySelector('tbody').innerHTML = 
                '<tr><td colspan="8" class="loading-row">Cargando facturas...</td></tr>';
            
            // Simular llamada API
            const response = await this.mockApiCall(params);
            
            this.renderInvoices(response.data);
            this.updateSummary(response.summary);
        } catch (error) {
            console.error('Error al cargar facturas:', error);
            this.showError('Error al cargar facturas. Intente nuevamente.');
        }
    }

    renderInvoices(invoices) {
        const tbody = document.getElementById('invoicesTable').querySelector('tbody');
        tbody.innerHTML = '';
        
        if (invoices.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="no-data">No se encontraron facturas</td></tr>';
            return;
        }
        
        invoices.forEach(invoice => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${invoice.number}</td>
                <td>${invoice.property}</td>
                <td>${invoice.period}</td>
                <td>${new Date(invoice.issueDate).toLocaleDateString()}</td>
                <td class="${this.isOverdue(invoice.dueDate) ? 'text-danger' : ''}">
                    ${new Date(invoice.dueDate).toLocaleDateString()}
                </td>
                <td>$${invoice.amount.toLocaleString()}</td>
                <td><span class="status-badge ${invoice.status}">${this.getStatusText(invoice.status)}</span></td>
                <td class="actions">
                    <button class="action-btn view-btn" data-id="${invoice.id}"><i class="fas fa-eye"></i></button>
                    <button class="action-btn print-btn" data-id="${invoice.id}"><i class="fas fa-print"></i></button>
                    ${invoice.status === 'pending' ? 
                        `<button class="action-btn payment-btn" data-id="${invoice.id}"><i class="fas fa-money-bill-wave"></i></button>` : 
                        ''}
                </td>
            `;
            tbody.appendChild(row);
        });
        
        // Agregar eventos a los botones
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => this.viewInvoice(btn.dataset.id));
        });
        
        document.querySelectorAll('.print-btn').forEach(btn => {
            btn.addEventListener('click', () => this.printInvoice(btn.dataset.id));
        });
        
        document.querySelectorAll('.payment-btn').forEach(btn => {
            btn.addEventListener('click', () => this.registerPayment(btn.dataset.id));
        });
    }

    // Más métodos para el módulo...
    // toggleCustomDates, openGenerationModal, generateInvoices, sendPaymentReminders, etc.
}

// Inicializar módulo cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('facturacion')) {
        new BillingModule();
    }
});

class FinanceModule {
    constructor() {
        this.currentPeriod = 'month';
        this.financeChart = null;
        this.comparisonChart = null;
        this.init();
    }

    init() {
        // Cargar Chart.js
        this.loadChartJS().then(() => {
            this.setupEventListeners();
            this.loadFinanceData();
        });
    }

    async loadChartJS() {
        if (typeof Chart === 'undefined') {
            await loadScript('https://cdn.jsdelivr.net/npm/chart.js');
        }
    }

    setupEventListeners() {
        // Period tabs
        document.querySelectorAll('.period-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.period-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentPeriod = tab.dataset.period;
                this.toggleCustomDates();
                this.loadFinanceData();
            });
        });
        
        // Apply custom dates
        document.getElementById('applyFinanceDates').addEventListener('click', () => this.loadFinanceData());
        
        // Report dropdown
        document.querySelectorAll('[data-report]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.generateReport(item.dataset.report);
            });
        });
        
        // Compare periods button
        document.getElementById('comparePeriodsBtn').addEventListener('click', () => this.openCompareModal());
        
        // Period type changes in compare modal
        document.getElementById('period1Type').addEventListener('change', (e) => this.updatePeriodControls('period1', e.target.value));
        document.getElementById('period2Type').addEventListener('change', (e) => this.updatePeriodControls('period2', e.target.value));
        
        // Load comparison data
        document.getElementById('exportComparison').addEventListener('click', () => this.exportComparison());
    }

    async loadFinanceData() {
        try {
            const params = {
                period: this.currentPeriod,
                startDate: this.currentPeriod === 'custom' ? document.getElementById('financeStartDate').value : null,
                endDate: this.currentPeriod === 'custom' ? document.getElementById('financeEndDate').value : null
            };
            
            // Mostrar loading
            document.querySelector('.finance-chart-container').classList.add('loading');
            document.getElementById('incomeCategories').innerHTML = '<div class="loading-text">Cargando...</div>';
            document.getElementById('expenseCategories').innerHTML = '<div class="loading-text">Cargando...</div>';
            
            // Simular llamada API
            const response = await this.mockApiCall(params);
            
            this.renderFinanceChart(response.chartData);
            this.updateKPIs(response.kpis);
            this.renderIncomeCategories(response.incomeCategories);
            this.renderExpenseCategories(response.expenseCategories);
        } catch (error) {
            console.error('Error al cargar datos financieros:', error);
            this.showError('Error al cargar datos financieros. Intente nuevamente.');
        } finally {
            document.querySelector('.finance-chart-container').classList.remove('loading');
        }
    }

    renderFinanceChart(data) {
        const ctx = document.getElementById('financeChart').getContext('2d');
        
        // Destruir gráfico anterior si existe
        if (this.financeChart) {
            this.financeChart.destroy();
        }
        
        this.financeChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Ingresos',
                        data: data.income,
                        backgroundColor: '#17BEBB',
                        borderColor: '#17BEBB',
                        borderWidth: 1
                    },
                    {
                        label: 'Gastos',
                        data: data.expenses,
                        backgroundColor: '#FF6B6B',
                        borderColor: '#FF6B6B',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += '$' + context.raw.toLocaleString();
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    // Más métodos para el módulo...
    // updateKPIs, renderIncomeCategories, renderExpenseCategories, openCompareModal, etc.
}

// Inicializar módulo cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('finanzas')) {
        new FinanceModule();
    }
});


document.addEventListener('DOMContentLoaded', function() {
            // Tabs functionality
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    // Remove active class from all tabs and contents
                    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                    
                    // Add active class to clicked tab
                    this.classList.add('active');
                    
                    // Show corresponding content
                    const tabId = this.getAttribute('data-tab');
                    document.getElementById(`${tabId}-tab`).classList.add('active');
                });
            });
            
            // Modal functionality
            const meetingModal = document.getElementById('meetingModal');
            const noticeModal = document.getElementById('noticeModal');
            const newMeetingBtn = document.getElementById('newMeetingBtn');
            const newNoticeBtn = document.getElementById('newNoticeBtn');
            const closeButtons = document.querySelectorAll('.modal-close, .btn-outline');
            
            // Open meeting modal
            newMeetingBtn.addEventListener('click', function() {
                meetingModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
            
            // Open notice modal
            newNoticeBtn.addEventListener('click', function() {
                noticeModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
            
            // Close modals
            closeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    meetingModal.style.display = 'none';
                    noticeModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                });
            });
            
            // Close modal when clicking outside
            window.addEventListener('click', function(event) {
                if (event.target === meetingModal) {
                    meetingModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
                if (event.target === noticeModal) {
                    noticeModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
            
            // Form submissions
            document.getElementById('saveMeetingBtn').addEventListener('click', function() {
                const title = document.getElementById('meetingTitle').value;
                const date = document.getElementById('meetingDate').value;
                const location = document.getElementById('meetingLocation').value;
                const agenda = document.getElementById('meetingAgenda').value;
                
                if (title && date && location && agenda) {
                    // Here you would typically send data to server
                    alert('Reunión programada exitosamente!');
                    meetingModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    
                    // Reset form
                    document.getElementById('meetingForm').reset();
                    
                    // In a real app, you would add the new meeting to the list
                } else {
                    alert('Por favor complete todos los campos');
                }
            });
            
            document.getElementById('saveNoticeBtn').addEventListener('click', function() {
                const title = document.getElementById('noticeTitle').value;
                const content = document.getElementById('noticeContent').value;
                const priority = document.getElementById('noticePriority').value;
                
                if (title && content) {
                    // Here you would typically send data to server
                    alert('Comunicado publicado exitosamente!');
                    noticeModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    
                    // Reset form
                    document.getElementById('noticeForm').reset();
                    
                    // In a real app, you would add the new notice to the list
                } else {
                    alert('Por favor complete todos los campos requeridos');
                }
            });
            
            // Sample functionality for action buttons
            document.querySelectorAll('.action-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const action = this.querySelector('i').className;
                    
                    if (action.includes('eye')) {
                        alert('Mostrando detalles...');
                    } else if (action.includes('download')) {
                        alert('Descargando documento...');
                    } else if (action.includes('share-alt')) {
                        alert('Compartiendo comunicado...');
                    }
                });
            });
        });