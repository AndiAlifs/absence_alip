import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-navbar',
    template: `
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
            <a href="/#solusi" class="text-slate-600 hover:text-indigo-600 font-semibold transition text-sm uppercase tracking-wider">Solusi</a>
            <a href="/#fitur" class="text-slate-600 hover:text-indigo-600 font-semibold transition text-sm uppercase tracking-wider">Fitur</a>
            <a href="/#klien" class="text-slate-600 hover:text-indigo-600 font-semibold transition text-sm uppercase tracking-wider">Klien</a>
            <a href="/#kontak" class="text-slate-600 hover:text-indigo-600 font-semibold transition text-sm uppercase tracking-wider">Kontak</a>
            <a *ngIf="showLoginButton" routerLink="/login" class="px-7 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-indigo-600 transition-all shadow-xl hover:shadow-indigo-500/20 active:scale-95">
              Portal Presensi
            </a>
          </div>
          <div class="lg:hidden flex items-center">
             <button class="p-2 text-slate-600"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg></button>
          </div>
        </div>
      </div>
    </nav>
  `,
    styles: []
})
export class NavbarComponent {
    @Input() showLoginButton: boolean = true;
}
