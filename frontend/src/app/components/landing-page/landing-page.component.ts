import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500/30">
      <!-- Premium Glassmorphism Navbar -->
      <nav class="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-200/50">
        <div class="max-w-7xl mx-auto px-6 sm:px-8">
          <div class="flex justify-between items-center h-20">
            <div class="flex items-center group cursor-pointer" routerLink="/">
              <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-3 shadow-sm group-hover:scale-110 transition-transform overflow-hidden border border-slate-100 p-1">
                <img src="assets/ypa_logo.png" alt="YPA Logo" class="w-full h-full object-contain">
              </div>
              <span class="text-2xl font-black text-slate-800 tracking-tighter group-hover:text-indigo-600 transition-colors uppercase">Handayani</span>
            </div>
            <div class="hidden lg:flex items-center space-x-10">
              <a href="#solusi" class="text-slate-600 hover:text-indigo-600 font-semibold transition text-sm uppercase tracking-wider">Solusi</a>
              <a href="#fitur" class="text-slate-600 hover:text-indigo-600 font-semibold transition text-sm uppercase tracking-wider">Fitur</a>
              <a href="#klien" class="text-slate-600 hover:text-indigo-600 font-semibold transition text-sm uppercase tracking-wider">Klien</a>
              <a href="#kontak" class="text-slate-600 hover:text-indigo-600 font-semibold transition text-sm uppercase tracking-wider">Kontak</a>
              <a routerLink="/login" class="px-7 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-indigo-600 transition-all shadow-xl hover:shadow-indigo-500/20 active:scale-95">
                Portal Presensi
              </a>
            </div>
            <div class="lg:hidden flex items-center">
               <button class="p-2 text-slate-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg></button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero Section: Premium Dark Aesthetic -->
      <section class="relative pt-24 pb-40 overflow-hidden">
        <!-- Dynamic Gradient Background -->
        <div class="absolute inset-0 bg-slate-950">
          <div class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div class="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px]"></div>
          <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
        </div>

        <div class="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div class="text-center">
            <div class="inline-flex items-center px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 text-sm font-bold mb-8 animate-bounce">
              <span class="flex h-2 w-2 rounded-full bg-indigo-500 mr-3"></span>
              Absensi Digital Handayani
            </div>
            
            <h1 class="text-5xl md:text-8xl font-black text-white tracking-tight leading-[1.1] mb-8">
              Digitalisasi Presensi<br>
              <span class="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-300">
                YPA-Handayani
              </span>
            </h1>

            <p class="max-w-3xl mx-auto text-xl text-slate-400 leading-relaxed mb-12">
              Transformasi manajemen SDM dengan presensi berbasis geofencing tercanggih. 
              Keamanan data berlapis, validasi GPS presisi tinggi, dan dashboard real-time 
              yang dirancang khusus untuk ekosistem <span class="text-white font-bold">YPA-Handayani</span>.
            </p>

            <div class="flex flex-col sm:flex-row justify-center items-center gap-6">
              <a routerLink="/login" class="w-full sm:w-auto px-10 py-5 rounded-2xl bg-indigo-600 text-white font-black text-xl hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-500/40 hover:-translate-y-1 active:translate-y-0">
                Mulai Absensi Sekarang
              </a>
              <a href="#fitur" class="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xl hover:bg-white/10 transition-all backdrop-blur-sm">
                Pelajari Sistem
              </a>
            </div>
          </div>
        </div>

        <!-- Float Decoration Elements -->
        <div class="hidden lg:block absolute left-20 top-40 w-16 h-16 border-2 border-indigo-500/30 rounded-2xl rotate-12 animate-float"></div>
        <div class="hidden lg:block absolute right-32 top-60 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full animate-pulse"></div>
      </section>

      <section id="klien" class="py-20 bg-white border-y border-slate-100">
        <div class="max-w-7xl mx-auto px-6 text-center">
          <p class="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs mb-10">Implementasi Strategis Oleh</p>
          <div class="flex flex-wrap justify-center items-center gap-12 md:gap-24 grayscale hover:grayscale-0 transition-all">
            <div class="flex items-center space-x-4">
              <img src="assets/ypa_logo.png" alt="YPA Handayani" class="h-16 w-auto">
              <span class="text-2xl font-black text-slate-800 tracking-tighter">YPA-HANDAYANI</span>
            </div>
            <div class="h-10 w-[2px] bg-slate-100 hidden md:block"></div>
            <div class="flex items-center space-x-4">
              <img src="assets/simi_logo.png" alt="Simi Studio" class="h-12 w-auto">
              <span class="text-2xl font-bold text-slate-900 tracking-tighter italic">SimiStudio</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Advanced Features: Premium Cards -->
      <section id="fitur" class="py-32 bg-slate-50 relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div class="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div class="max-w-2xl text-left">
               <h2 class="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                Teknologi Presensi Tanpa Kompromi
              </h2>
              <p class="text-xl text-slate-500">
                YPA-HANDAYANI mengintegrasikan algoritma Haversine dengan verifikasi identitas berlapis untuk menjamin akurasi data 99.9%.
              </p>
            </div>
            <div class="text-indigo-600 font-black text-6xl opacity-10 select-none">FEATURES</div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Feature Card 1 -->
            <div class="group bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-200/50 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[100px] -mr-10 -mt-10 group-hover:bg-indigo-600 group-hover:w-full group-hover:h-full group-hover:rounded-none group-hover:m-0 transition-all duration-500"></div>
              <div class="relative z-10">
                <div class="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:bg-white transition-colors duration-500">
                  <svg class="w-8 h-8 text-white group-hover:text-indigo-600 transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                </div>
                <h3 class="text-2xl font-black text-slate-900 mb-4 group-hover:text-white transition-colors duration-500">Precision Geofencing</h3>
                <p class="text-slate-500 group-hover:text-indigo-100 transition-colors duration-500 leading-relaxed">
                  Validasi lokasi karyawan dalam radius meter yang ditentukan. Anti-spoofing dan deteksi emulator otomatis.
                </p>
              </div>
            </div>

            <!-- Feature Card 2 -->
            <div class="group bg-slate-900 p-10 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-800 relative overflow-hidden">
               <div class="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <div class="relative z-10">
                <div class="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm">
                  <svg class="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h3 class="text-2xl font-black text-white mb-4">Real-time Dashboard</h3>
                <p class="text-slate-400 leading-relaxed">
                  Monitor seluruh cabang dalam satu layar. Laporan kehadiran harian diolah secara instan tanpa jeda waktu.
                </p>
              </div>
            </div>

            <!-- Feature Card 3 -->
            <div class="group bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-200/50 relative overflow-hidden">
               <div class="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -mr-10 -mt-10 group-hover:bg-slate-900 group-hover:w-full group-hover:h-full group-hover:rounded-none group-hover:m-0 transition-all duration-500"></div>
               <div class="relative z-10">
                <div class="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:bg-white transition-colors duration-500">
                  <svg class="w-8 h-8 text-white group-hover:text-slate-900 transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 21a11.955 11.955 0 01-9.618-7.016m18.236 0a11.958 11.958 0 00-18.236 0"></path></svg>
                </div>
                <h3 class="text-2xl font-black text-slate-900 mb-4 group-hover:text-white transition-colors duration-500">Automated Approval</h3>
                <p class="text-slate-500 group-hover:text-slate-400 transition-colors duration-500 leading-relaxed">
                  Sistem otomatis menyetujui absensi yang memnuhi kriteria, mengurangi beban administratif manajer hingga 80%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA: Premium Large Section -->
      <section class="py-40 bg-indigo-600 relative overflow-hidden">
        <div class="absolute inset-0">
          <div class="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10"></div>
          <div class="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-[80px]"></div>
          <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-900/40 rounded-full blur-[80px]"></div>
        </div>
        
        <div class="max-w-5xl mx-auto px-6 text-center relative z-10">
          <h2 class="text-4xl md:text-7xl font-black text-white mb-10 tracking-tighter leading-none">
            Siap Maju Bersama <br>YPA-Handayani?
          </h2>
          <p class="text-2xl text-indigo-100 mb-16 opacity-90 max-w-3xl mx-auto font-medium">
            Gabung dalam ekosistem kerja digital yang lebih transparan, efisien, dan modern.
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-6">
            <a routerLink="/login" class="px-12 py-6 rounded-2xl bg-white text-indigo-600 font-black text-2xl shadow-2xl hover:scale-105 transition-transform active:scale-95">
              Masuk ke Portal
            </a>
            <a href="https://wa.me/6285171213154" class="px-12 py-6 rounded-2xl bg-indigo-800/40 border border-indigo-400/30 text-white font-black text-2xl backdrop-blur-md hover:bg-indigo-800/60 transition-all">
              Hubungi Helpdesk
            </a>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section id="kontak" class="py-32 bg-white relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h2 class="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Butuh Bantuan atau Custom Project?</h2>
          <p class="text-xl text-slate-500 mb-16 max-w-2xl mx-auto">
            Tim kami siap membantu integrasi sistem absensi untuk perusahaan Anda atau pengembangan fitur khusus yang Anda butuhkan.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <!-- Email Card -->
            <a href="mailto:andyalyfsyah4@gmail.com" class="group p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500 text-center">
              <div class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <h3 class="text-2xl font-black text-slate-900 mb-2">Email Kami</h3>
              <p class="text-slate-500 mb-6">Konsultasi detail project</p>
              <span class="text-red-600 font-bold hover:underline">andyalyfsyah4@gmail.com</span>
            </a>

            <!-- WhatsApp Card -->
            <a href="https://wa.me/6285171213154" target="_blank" class="group p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500 text-center">
              <div class="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.654-.698c1.09.594 2.074.887 3.082.887l.003-.001c3.181 0 5.767-2.586 5.768-5.766.001-3.18-2.585-5.766-5.766-5.766zm9.261 5.767c0 5.106-4.159 9.266-9.263 9.266-1.571 0-3.08-.41-4.433-1.127l-4.706 1.246 1.259-4.577c-.822-1.423-1.258-3.044-1.259-4.708 0-5.106 4.158-9.267 9.263-9.267 2.474 0 4.799.963 6.549 2.713s2.714 4.075 2.714 6.548z"/></svg>
              </div>
              <h3 class="text-2xl font-black text-slate-900 mb-2">WhatsApp</h3>
              <p class="text-slate-500 mb-6">Respon cepat & tanya jawab</p>
              <span class="text-emerald-600 font-bold hover:underline">Chat 0851-7121-3154</span>
            </a>
          </div>
        </div>
      </section>

      <!-- Minimalist Footer -->
      <footer class="bg-slate-950 text-slate-500 py-20 px-6 border-t border-slate-900">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
            <div>
              <div class="flex items-center mb-6">
                 <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm overflow-hidden border border-slate-800 p-1">
                    <img src="assets/ypa_logo.png" alt="YPA Logo" class="w-full h-full object-contain">
                  </div>
                <span class="text-xl font-black text-white tracking-widest uppercase">YPA-HANDAYANI</span>
              </div>
              <p class="text-sm max-w-sm mb-8 opacity-60">
                Solusi Enterprise untuk Manajemen Presensi Elektronik yang Aman dan Nyaman. 
                Didedikasikan untuk pengembangan tim YPA-Handayani.
              </p>
            </div>
            <div class="flex space-x-12">
              <div class="space-y-4">
                <p class="text-white font-bold text-sm uppercase tracking-widest">Akses Cepat</p>
                <ul class="space-y-2 text-sm">
                  <li><a routerLink="/login" class="hover:text-indigo-400 transition">Login Karyawan</a></li>
                  <li><a routerLink="/login" class="hover:text-indigo-400 transition">Portal Manajer</a></li>
                  <li><a routerLink="/legacy" class="hover:text-indigo-400 transition opacity-40">Old Landing</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="mt-20 pt-8 border-t border-slate-900/50 flex flex-col md:flex-row justify-between items-center text-xs gap-6 uppercase tracking-widest font-bold">
            <p>&copy; 2026 YPA-HANDAYANI. All rights reserved.</p>
            <div class="flex items-center space-x-8">
              <span>Made by <a href="#" class="text-slate-300 hover:text-indigo-400 transition">Andi Alifsyah</a></span>
              <span>Collaborative with <a href="https://simistudio.co" class="inline-flex items-center text-slate-300 hover:text-indigo-400 transition"><img src="assets/ypa_logo.png" alt="Simi Logo" class="h-4 w-auto mr-2 brightness-0 invert opacity-60">Simi Studio</a></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(12deg); }
      50% { transform: translateY(-20px) rotate(15deg); }
    }
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
  `]
})
export class LandingPageComponent { }
