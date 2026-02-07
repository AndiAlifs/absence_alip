import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
      <!-- Navbar -->
      <nav class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center">
              <span class="text-2xl font-extrabold text-blue-600 tracking-tight">NYAMPE</span>
            </div>
            <div class="hidden md:flex items-center space-x-8">
              <a href="#fitur" class="text-gray-600 hover:text-blue-600 font-medium transition">Fitur</a>
              <a href="#keunggulan" class="text-gray-600 hover:text-blue-600 font-medium transition">Keunggulan</a>
              <a href="#kontak" class="text-gray-600 hover:text-blue-600 font-medium transition">Kontak</a>
              <a routerLink="/login" class="px-5 py-2.5 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Masuk
              </a>
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="bg-gradient-to-br from-blue-600 to-indigo-800 pt-20 pb-32 overflow-hidden relative">
        <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span class="inline-block py-1 px-3 rounded-full bg-blue-500/30 text-blue-100 text-sm font-semibold mb-6 border border-blue-400/30">
            🚀 Solusi Absensi Modern 2026
          </span>
          <h1 class="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Pantau Kehadiran Tim<br>
            <span class="text-blue-200">Semudah Kirim Chat</span>
          </h1>
          <p class="mt-4 max-w-2xl mx-auto text-xl text-blue-100 mb-10">
            Tinggalkan mesin fingerprint. Validasi lokasi GPS akurat, anti-fake GPS, 
            dan laporan real-time dalam satu aplikasi Super App.
          </p>
          <div class="flex justify-center space-x-4">
            <a routerLink="/login" class="px-8 py-4 rounded-full bg-white text-blue-700 font-bold text-lg hover:bg-gray-100 transition shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
              Mulai Sekarang Gratis
            </a>
            <a href="#kontak" class="px-8 py-4 rounded-full border-2 border-white text-white font-bold text-lg hover:bg-white/10 transition">
              Hubungi Kami
            </a>
          </div>
        </div>
        
        <!-- Decoration Circles -->
        <div class="absolute top-0 left-0 -ml-20 -mt-20 w-64 h-64 rounded-full bg-blue-500 opacity-20 filter blur-3xl"></div>
        <div class="absolute bottom-0 right-0 -mr-20 -mb-20 w-80 h-80 rounded-full bg-indigo-500 opacity-20 filter blur-3xl"></div>
      </section>

      <!-- Stats Section -->
      <section class="relative -mt-16 z-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bg-white rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div class="p-8 text-center">
              <div class="text-4xl font-bold text-blue-600 mb-2">100%</div>
              <div class="text-gray-600 font-medium">Akurasi Lokasi</div>
            </div>
            <div class="p-8 text-center">
              <div class="text-4xl font-bold text-blue-600 mb-2">0</div>
              <div class="text-gray-600 font-medium">Biaya Maintenance Alat</div>
            </div>
            <div class="p-8 text-center">
              <div class="text-4xl font-bold text-blue-600 mb-2">4+</div>
              <div class="text-gray-600 font-medium">Cabang Terintegrasi</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Grid (Keunggulan) -->
      <section id="keunggulan" class="py-24 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Mengapa Memilih NYAMPE?</h2>
            <p class="text-xl text-gray-500 max-w-2xl mx-auto">Kami mengerti masalah absensi Anda. NYAMPE hadir sebagai solusi yang nyaman dan aman.</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
            <!-- Feature 1 -->
            <div class="bg-gray-50 rounded-2xl p-8 transition hover:shadow-lg border border-gray-100">
              <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">Geolokasi Presisi</h3>
              <p class="text-gray-600 leading-relaxed">
                Sistem kami menggunakan formula Haversine untuk menghitung jarak hingga presisi meter. Tidak bisa ditipu dengan Mock Location sembarangan.
              </p>
            </div>

            <!-- Feature 2 -->
            <div class="bg-gray-50 rounded-2xl p-8 transition hover:shadow-lg border border-gray-100">
              <div class="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">Multi-Kantor</h3>
              <p class="text-gray-600 leading-relaxed">
                Punya banyak cabang? Manager bisa mengelola hingga 4 kantor sekaligus. Karyawan otomatis terdeteksi di cabang terdekat.
              </p>
            </div>

            <!-- Feature 3 -->
            <div class="bg-gray-50 rounded-2xl p-8 transition hover:shadow-lg border border-gray-100">
              <div class="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 text-green-600">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">Auto-Approval</h3>
              <p class="text-gray-600 leading-relaxed">
                Jika karyawan berada dalam radius kantor, sistem otomatis menyetujui. Hemat 80% waktu manajer untuk review manual. 
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Device Showcase: Employee (Phone) -->
      <section id="fitur" class="py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <span class="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">TAMPILAN KARYAWAN</span>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Semua yang Karyawan Butuhkan<br>dalam Genggaman</h2>
            <p class="text-xl text-gray-500 max-w-2xl mx-auto">Dioptimalkan untuk smartphone. Satu klik absensi, cuti, dan riwayat.</p>
          </div>
          
          <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <!-- Phone Frame -->
            <div class="flex-shrink-0 relative">
              <div class="relative mx-auto" style="width: 280px; height: 580px;">
                <!-- Phone Body -->
                <div class="absolute inset-0 bg-gray-900 rounded-[3rem] shadow-2xl border-4 border-gray-800">
                  <!-- Notch -->
                  <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-2xl z-20"></div>
                  <!-- Screen -->
                  <div class="absolute top-3 left-3 right-3 bottom-3 bg-white rounded-[2.5rem] overflow-hidden">
                    <!-- Status Bar -->
                    <div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 pt-10 pb-4">
                      <div class="flex items-center justify-between text-white text-xs mb-3">
                        <span>09:41</span>
                        <div class="flex items-center space-x-1">
                          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"/></svg>
                          <span>NYAMPE</span>
                        </div>
                      </div>
                      <h3 class="text-white font-bold text-lg">Selamat Pagi, Budi 👋</h3>
                      <p class="text-blue-200 text-xs mt-1">Jum'at, 7 Feb 2026</p>
                    </div>
                    <!-- Clock-In Card -->
                    <div class="px-4 py-3">
                      <div class="bg-blue-50 rounded-xl p-4 border border-blue-100 mb-3">
                        <div class="flex items-center justify-between mb-3">
                          <span class="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">📍 CLOCK IN</span>
                          <span class="text-xs text-green-600 font-bold">✅ Approved</span>
                        </div>
                        <div class="text-center py-2">
                          <div class="text-3xl font-bold text-gray-900">08:47</div>
                          <div class="text-xs text-gray-500 mt-1">Kantor Kendari • 23m dari lokasi</div>
                        </div>
                        <div class="bg-blue-600 text-white text-center py-3 rounded-xl font-bold text-sm mt-2 shadow-md">
                          🎯 Sudah Clock In Hari Ini
                        </div>
                      </div>
                      <!-- Quick Actions -->
                      <div class="grid grid-cols-2 gap-2">
                        <div class="bg-orange-50 border border-orange-100 rounded-xl p-3 text-center">
                          <div class="text-lg mb-1">📋</div>
                          <div class="text-xs font-semibold text-gray-700">Ajukan Cuti</div>
                        </div>
                        <div class="bg-purple-50 border border-purple-100 rounded-xl p-3 text-center">
                          <div class="text-lg mb-1">📊</div>
                          <div class="text-xs font-semibold text-gray-700">Riwayat</div>
                        </div>
                      </div>
                      <!-- Leave Status -->
                      <div class="mt-3 bg-green-50 border border-green-100 rounded-xl p-3">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center">
                            <span class="text-sm mr-2">🏖️</span>
                            <div>
                              <div class="text-xs font-semibold text-gray-700">Cuti 10-12 Feb</div>
                              <div class="text-xs text-gray-500">Liburan keluarga</div>
                            </div>
                          </div>
                          <span class="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">Pending</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Phone Button -->
                <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-28 h-1 bg-gray-600 rounded-full"></div>
              </div>
              <!-- Reflection -->
              <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-48 h-8 bg-gradient-to-b from-gray-200/50 to-transparent rounded-full filter blur-xl"></div>
            </div>

            <!-- Feature List (Employee) -->
            <div class="flex-1 space-y-6">
              <div class="flex items-start space-x-4 group">
                <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <div>
                  <h4 class="text-lg font-bold text-gray-900">Clock-In Satu Klik</h4>
                  <p class="text-gray-600">Buka aplikasi, tekan tombol, selesai. GPS otomatis terdeteksi dan divalidasi dengan lokasi kantor terdekat.</p>
                </div>
              </div>
              <div class="flex items-start space-x-4 group">
                <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <h4 class="text-lg font-bold text-gray-900">Auto-Approval Instan</h4>
                  <p class="text-gray-600">Dalam radius kantor? Langsung disetujui otomatis. Tidak perlu tunggu manajer. Cepat & tanpa ribet.</p>
                </div>
              </div>
              <div class="flex items-start space-x-4 group">
                <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-orange-200 transition">
                  <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <h4 class="text-lg font-bold text-gray-900">Pengajuan Cuti Digital</h4>
                  <p class="text-gray-600">Ajukan cuti langsung dari HP. Pilih tanggal, isi alasan, kirim. Pantau status approval real-time.</p>
                </div>
              </div>
              <div class="flex items-start space-x-4 group">
                <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <div>
                  <h4 class="text-lg font-bold text-gray-900">Riwayat Kehadiran Lengkap</h4>
                  <p class="text-gray-600">Lihat semua riwayat absensi dan cuti. Filter berdasarkan bulan. Transparan dan mudah diakses kapan saja.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Device Showcase: Manager (Tablet) -->
      <section id="demo" class="py-24 bg-white overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <span class="inline-block px-4 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-4">TAMPILAN MANAJER</span>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Dashboard Lengkap untuk<br>Kontrol Penuh</h2>
            <p class="text-xl text-gray-500 max-w-2xl mx-auto">Dioptimalkan untuk tablet & desktop. Monitor semua cabang dari satu layar.</p>
          </div>
          
          <div class="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
            <!-- Tablet Frame -->
            <div class="flex-shrink-0 relative">
              <div class="relative mx-auto" style="width: 520px; max-width: 90vw; height: 380px;">
                <!-- Tablet Body -->
                <div class="absolute inset-0 bg-gray-900 rounded-[1.5rem] shadow-2xl border-4 border-gray-800">
                  <!-- Camera -->
                  <div class="absolute top-3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-700 rounded-full z-20"></div>
                  <!-- Screen -->
                  <div class="absolute top-4 left-4 right-4 bottom-4 bg-white rounded-xl overflow-hidden">
                    <!-- Top Bar -->
                    <div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-3 flex items-center justify-between">
                      <div class="flex items-center space-x-3">
                        <span class="text-white font-bold text-sm tracking-wider">NYAMPE</span>
                        <span class="text-blue-200 text-xs">|</span>
                        <span class="text-blue-200 text-xs">Panel Manajer</span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span class="bg-green-400 w-2 h-2 rounded-full"></span>
                        <span class="text-white text-xs">Admin</span>
                      </div>
                    </div>
                    <!-- Dashboard Content -->
                    <div class="p-4">
                      <!-- Stats Row -->
                      <div class="grid grid-cols-4 gap-2 mb-3">
                        <div class="bg-green-50 border border-green-100 rounded-lg p-2 text-center">
                          <div class="text-lg font-bold text-green-600">42</div>
                          <div class="text-[9px] text-gray-500 font-medium">Hadir</div>
                        </div>
                        <div class="bg-red-50 border border-red-100 rounded-lg p-2 text-center">
                          <div class="text-lg font-bold text-red-600">3</div>
                          <div class="text-[9px] text-gray-500 font-medium">Tidak Hadir</div>
                        </div>
                        <div class="bg-yellow-50 border border-yellow-100 rounded-lg p-2 text-center">
                          <div class="text-lg font-bold text-yellow-600">7</div>
                          <div class="text-[9px] text-gray-500 font-medium">Terlambat</div>
                        </div>
                        <div class="bg-blue-50 border border-blue-100 rounded-lg p-2 text-center">
                          <div class="text-lg font-bold text-blue-600">5</div>
                          <div class="text-[9px] text-gray-500 font-medium">Cuti</div>
                        </div>
                      </div>
                      <!-- Table -->
                      <div class="bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                        <div class="grid grid-cols-5 gap-0 text-[9px] font-bold text-gray-500 uppercase bg-gray-100 px-3 py-2">
                          <span>Nama</span><span>Kantor</span><span>Waktu</span><span>Jarak</span><span>Status</span>
                        </div>
                        <div class="divide-y divide-gray-100">
                          <div class="grid grid-cols-5 gap-0 text-[10px] px-3 py-2 items-center">
                            <span class="font-medium text-gray-800">Budi S.</span>
                            <span class="text-gray-500">Kendari</span>
                            <span class="text-gray-500">08:47</span>
                            <span class="text-gray-500">23m</span>
                            <span class="bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full text-center text-[8px] font-bold">Approved</span>
                          </div>
                          <div class="grid grid-cols-5 gap-0 text-[10px] px-3 py-2 items-center">
                            <span class="font-medium text-gray-800">Siti A.</span>
                            <span class="text-gray-500">Jakarta</span>
                            <span class="text-gray-500">09:12</span>
                            <span class="text-gray-500">15m</span>
                            <span class="bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full text-center text-[8px] font-bold">Late</span>
                          </div>
                          <div class="grid grid-cols-5 gap-0 text-[10px] px-3 py-2 items-center">
                            <span class="font-medium text-gray-800">Andi R.</span>
                            <span class="text-gray-500">Makassar</span>
                            <span class="text-gray-500">08:55</span>
                            <span class="text-red-500">520m</span>
                            <span class="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full text-center text-[8px] font-bold">Pending</span>
                          </div>
                          <div class="grid grid-cols-5 gap-0 text-[10px] px-3 py-2 items-center">
                            <span class="font-medium text-gray-800">Dewi L.</span>
                            <span class="text-gray-500">Palopo</span>
                            <span class="text-gray-500">08:30</span>
                            <span class="text-gray-500">8m</span>
                            <span class="bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full text-center text-[8px] font-bold">Approved</span>
                          </div>
                        </div>
                      </div>
                      <!-- Bottom Actions -->
                      <div class="flex items-center justify-between mt-3">
                        <div class="flex space-x-2">
                          <span class="bg-indigo-100 text-indigo-700 text-[9px] font-bold px-2 py-1 rounded-lg">🏢 4 Kantor Aktif</span>
                          <span class="bg-blue-100 text-blue-700 text-[9px] font-bold px-2 py-1 rounded-lg">📊 Laporan</span>
                        </div>
                        <div class="flex space-x-1">
                          <span class="bg-orange-100 text-orange-700 text-[9px] font-bold px-2 py-1 rounded-lg">⏳ 2 Pending</span>
                          <span class="bg-purple-100 text-purple-700 text-[9px] font-bold px-2 py-1 rounded-lg">📝 3 Cuti</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Reflection -->
              <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-64 h-8 bg-gradient-to-b from-gray-200/50 to-transparent rounded-full filter blur-xl"></div>
            </div>

            <!-- Feature List (Manager) -->
            <div class="flex-1 space-y-6">
              <div class="flex items-start space-x-4 group">
                <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-200 transition">
                  <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                </div>
                <div>
                  <h4 class="text-lg font-bold text-gray-900">Dashboard Real-Time</h4>
                  <p class="text-gray-600">Lihat siapa yang sudah hadir, terlambat, atau belum datang. Data update otomatis tanpa perlu refresh.</p>
                </div>
              </div>
              <div class="flex items-start space-x-4 group">
                <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                </div>
                <div>
                  <h4 class="text-lg font-bold text-gray-900">Kelola Multi-Kantor</h4>
                  <p class="text-gray-600">Atur hingga 4 kantor cabang sekaligus. Set radius, jam masuk, dan lokasi GPS tiap kantor dengan mudah.</p>
                </div>
              </div>
              <div class="flex items-start space-x-4 group">
                <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-orange-200 transition">
                  <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                </div>
                <div>
                  <h4 class="text-lg font-bold text-gray-900">Approval Cuti & Absensi</h4>
                  <p class="text-gray-600">Setujui atau tolak permintaan cuti dan clock-in yang di luar radius. Semua dari satu dashboard terpusat.</p>
                </div>
              </div>
              <div class="flex items-start space-x-4 group">
                <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <div>
                  <h4 class="text-lg font-bold text-gray-900">Laporan & Export</h4>
                  <p class="text-gray-600">Rekap kehadiran harian, bulanan, per karyawan. Filter data, lihat statistik keterlambatan, dan cetak laporan.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="bg-blue-900 py-20 relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
        <div class="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 class="text-3xl md:text-5xl font-bold text-white mb-8">Siap Meningkatkan Disiplin Tim?</h2>
          <p class="text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
            Bergabunglah dengan perusahaan modern yang telah beralih ke NYAMPE.
            Praktis, Hemat, dan Akurat.
          </p>
          <a routerLink="/login" class="inline-block px-10 py-4 rounded-full bg-white text-blue-900 font-bold text-xl hover:bg-gray-100 transition shadow-xl transform hover:scale-105">
            Coba NYAMPE Sekarang
          </a>
          <p class="mt-6 text-sm text-blue-400">Gratis uji coba untuk 14 hari pertama *</p>
        </div>
      </section>

      <!-- Contact Section -->
      <section id="kontak" class="py-20 bg-gray-50 border-t border-gray-100">
        <div class="max-w-4xl mx-auto px-4 text-center">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Butuh Bantuan atau Custom Project?</h2>
          <p class="text-xl text-gray-600 mb-12">
            Tim kami siap membantu integrasi sistem absensi untuk perusahaan Anda.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Email Option -->
            <a href="mailto:andyalyfsyah4@gmail.com" class="block bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 group border border-gray-100">
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-200 transition">
                 <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Email Kami</h3>
              <p class="text-gray-500 mb-4">Konsultasi detail project</p>
              <span class="text-red-600 font-semibold group-hover:underline">andyalyfsyah4@gmail.com</span>
            </a>

            <!-- WhatsApp Option -->
            <a href="https://wa.me/6285171213154?text=Halo%20Tim%20NYAMPE,%20saya%20tertarik%20dengan%20sistem%20absensi%20ini." target="_blank" class="block bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 group border border-gray-100">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition">
                 <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.654-.698c1.09.594 2.074.887 3.082.887l.003-.001c3.181 0 5.767-2.586 5.768-5.766.001-3.18-2.585-5.766-5.766-5.766zm9.261 5.767c0 5.106-4.159 9.266-9.263 9.266-1.571 0-3.08-.41-4.433-1.127l-4.706 1.246 1.259-4.577c-.822-1.423-1.258-3.044-1.259-4.708 0-5.106 4.158-9.267 9.263-9.267 2.474 0 4.799.963 6.549 2.713s2.714 4.075 2.714 6.548z"/></svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">WhatsApp</h3>
              <p class="text-gray-500 mb-4">Respon cepat & tanya jawab</p>
              <span class="text-green-600 font-semibold group-hover:underline">Chat 0851-7121-3154</span>
            </a>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <div class="mb-6 md:mb-0">
              <span class="text-2xl font-bold text-white tracking-widest">NYAMPE</span>
              <p class="mt-2 text-sm">Nyaman Manajemen Presensi Elektronik</p>
            </div>
            <div class="flex space-x-6">
              <a href="#" class="hover:text-white transition">Tentang Kami</a>
              <a href="#" class="hover:text-white transition">Kebijakan Privasi</a>
              <a href="#" class="hover:text-white transition">Bantuan</a>
            </div>
          </div>
          <div class="mt-8 border-t border-gray-800 pt-8 text-sm">
            <div class="flex flex-col md:flex-row justify-between items-center gap-4">
              <div class="text-center md:text-left">
                &copy; 2026 NYAMPE Inc. All rights reserved. Made by <span class="text-gray-300 font-medium">Andi Alifsyah</span> and <a href="https://www.instagram.com/simistudio.co/" target="_blank" class="text-gray-300 font-medium hover:text-white transition">Simi Studio</a>.
              </div>
              <div class="flex items-center space-x-6">
                <a href="mailto:andyalyfsyah4@gmail.com" class="flex items-center hover:text-white transition group">
                  <svg class="w-4 h-4 mr-2 text-gray-500 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  andyalyfsyah4@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class LandingPageComponent {}
