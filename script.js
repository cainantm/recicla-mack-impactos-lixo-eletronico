        document.addEventListener('DOMContentLoaded', function () {
            const growthChartEl = document.getElementById('growthChart');
            const compositionChartEl = document.getElementById('compositionChart');
            let growthChart, compositionChart;

            const chartFontColor = (isDark) => isDark ? '#cbd5e1' : '#4A4A4A';
            const chartGridColor = (isDark) => isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

            function createGrowthChart(isDark) {
                if (growthChart) growthChart.destroy();
                growthChart = new Chart(growthChartEl.getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: ['2015', '2017', '2019', '2021', '2023 (est.)', '2025 (proj.)'],
                        datasets: [{
                            label: 'Milhões de Toneladas',
                            data: [44.4, 48.5, 53.6, 57.4, 61.3, 65.4],
                            backgroundColor: isDark ? 'rgba(251, 191, 36, 0.2)' : 'rgba(217, 119, 6, 0.1)',
                            borderColor: isDark ? '#FBBF24' : '#D97706',
                            borderWidth: 3,
                            tension: 0.4,
                            fill: true,
                        }]
                    },
                    options: {
                        responsive: true, maintainAspectRatio: false,
                        scales: {
                            y: { 
                                beginAtZero: false, 
                                title: { display: true, text: 'Milhões de Toneladas', color: chartFontColor(isDark) },
                                ticks: { color: chartFontColor(isDark) },
                                grid: { color: chartGridColor(isDark) }
                            },
                            x: { 
                                ticks: { color: chartFontColor(isDark) },
                                grid: { color: chartGridColor(isDark) }
                            }
                        },
                        plugins: { legend: { display: false } }
                    }
                });
            }

            function createCompositionChart(isDark) {
                if (compositionChart) compositionChart.destroy();
                compositionChart = new Chart(compositionChartEl.getContext('2d'), {
                    type: 'doughnut',
                    data: {
                        labels: ['Metais Ferrosos', 'Plásticos', 'Metais Não-Ferrosos', 'Vidro', 'Outros', 'Componentes Perigosos'],
                        datasets: [{
                            label: 'Composição do E-Lixo',
                            data: [30, 25, 20, 15, 8, 2],
                            backgroundColor: ['#64748B', '#3B82F6', '#F59E0B', '#10B981', '#9CA3AF', '#EF4444'],
                            hoverOffset: 4, borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true, maintainAspectRatio: false,
                        plugins: {
                            legend: { 
                                position: 'bottom', 
                                labels: { usePointStyle: true, boxWidth: 8, padding: 15, color: chartFontColor(isDark), font: { size: 11 } }
                            }
                        }
                    }
                });
            }

            // Theme Toggler
            const themeToggleBtn = document.getElementById('theme-toggle');
            const darkIcon = document.getElementById('theme-toggle-dark-icon');
            const lightIcon = document.getElementById('theme-toggle-light-icon');
            
            function updateTheme(isDark) {
                if (isDark) {
                    document.documentElement.classList.add('dark');
                    lightIcon.classList.remove('hidden');
                    darkIcon.classList.add('hidden');
                    localStorage.setItem('theme', 'dark');
                } else {
                    document.documentElement.classList.remove('dark');
                    darkIcon.classList.remove('hidden');
                    lightIcon.classList.add('hidden');
                    localStorage.setItem('theme', 'light');
                }
                createGrowthChart(isDark);
                createCompositionChart(isDark);
            }

            const isDarkMode = () => document.documentElement.classList.contains('dark');
            updateTheme(isDarkMode());

            themeToggleBtn.addEventListener('click', () => {
                updateTheme(!isDarkMode());
            });

            // Back to Top Button
            const toTopBtn = document.getElementById('to-top-btn');
            if (toTopBtn) {
                window.addEventListener('scroll', () => {
                    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                        toTopBtn.classList.remove('opacity-0', 'invisible');
                    } else {
                        toTopBtn.classList.add('opacity-0', 'invisible');
                    }
                });
                toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
            }

            // Count-up Animation
            const countUpObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const target = parseFloat(el.textContent);
                        let current = 0;
                        const duration = 2000;
                        const stepTime = 20;
                        const steps = duration / stepTime;
                        const increment = target / steps;
                        const hasDecimal = el.textContent.includes('.');
                        const decimalPlaces = hasDecimal ? el.textContent.split('.')[1].length : 0;

                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                clearInterval(timer);
                                el.textContent = target.toFixed(decimalPlaces);
                            } else {
                                el.textContent = current.toFixed(decimalPlaces);
                            }
                        }, stepTime);

                        observer.unobserve(el);
                    }
                });
            }, { threshold: 0.7 });

            document.querySelectorAll('[data-countup]').forEach(el => {
                countUpObserver.observe(el);
            });

            // Device Info Section
            const toxicData = {
                smartphone: ['Chumbo (soldas)', 'Mercúrio (telas LCD antigas)', 'Arsênico (chips)', 'Cádmio (baterias)', 'Retardantes de chama bromados (plásticos)'],
                tv: ['Chumbo (tubos de raios catódicos - CRTs)', 'Mercúrio (lâmpadas de tela plana)', 'Cádmio (fósforos de CRT)', 'Bário', 'Plásticos com retardantes de chama'],
                computer: ['Chumbo (monitores e soldas)', 'Cádmio (placas de circuito, baterias)', 'Mercúrio (interruptores, telas)', 'Cromo Hexavalente (carcaças metálicas)', 'Retardantes de chama bromados (plásticos, cabos)']
            };
            const toxicListEl = document.getElementById('toxic-list');
            const deviceSelectors = document.querySelectorAll('.device-selector');
            const deviceInfoTitle = document.querySelector('#device-info h4');
            
            function updateDeviceInfo(device) {
                const deviceNameMap = { smartphone: 'Smartphone', tv: 'Televisor', computer: 'Computador' };
                deviceInfoTitle.textContent = `Substâncias Perigosas em: ${deviceNameMap[device]}`;
                toxicListEl.innerHTML = toxicData[device].map(item => `<li>${item}</li>`).join('');
                deviceSelectors.forEach(btn => {
                    btn.classList.remove('active-device');
                    if (btn.dataset.device === device) btn.classList.add('active-device');
                });
            }
            deviceSelectors.forEach(button => {
                button.addEventListener('click', (e) => updateDeviceInfo(e.currentTarget.dataset.device));
            });
            updateDeviceInfo('smartphone');
        });

        AOS.init({ duration: 700, once: true });