import { FormControl } from '@angular/forms';
import { VolumeInfo, ImageLinks, Item, LivrosResultado } from './../../models/interfaces';
import { Component, OnDestroy } from '@angular/core';
import { EMPTY, Subscription, catchError, debounce, debounceTime, distinctUntilChanged, filter, map, of, switchMap, tap, throwError } from 'rxjs';
import { Livro } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

const PAUSA = 500;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
})
export class ListaLivrosComponent /*implements OnDestroy*/ {
  // listaLivros: Livro[];
  campoBusca = new FormControl();
  mensagemErro = '';
  livrosResultado: LivrosResultado;
  // subscription: Subscription;
  // livro: Livro;

  constructor(private service: LivroService) {}

  // totalDeLivros$ = this.campoBusca.valueChanges.pipe(
  //   debounceTime(PAUSA),
  //   filter((valorDigitado) => valorDigitado.length >= 3),
  //   tap(() => console.log('Fluxo inicial')),
  //   distinctUntilChanged(),
  //   switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
  //   map(resultado => this.livrosResultado = resultado),
  //   catchError(erro => {
  //     console.log(erro)
  //     return of()
  //   })
  // )

  livrosEncontrados$ = this.campoBusca.valueChanges
    .pipe(
      debounceTime(PAUSA),
      filter((valorDigitado) => valorDigitado.length >= 3),
      tap(() => console.log('Fluxo inicial')),
      switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
      map(resultado => this.livrosResultado = resultado),
      tap((retornoAPI) => console.log(retornoAPI)),
      map(resultado => resultado.items ?? []),
      map((items) => this.livrosResultadoParaLivros(items)),
      catchError((erro) => {
        // this.mensagemErro ='Ops, ocorreu um erro. Recarregue a aplicação!'
        // return EMPTY
        console.log(erro)
        return throwError(() => new Error(this.mensagemErro ='Ops, ocorreu um erro. Recarregue a aplicação!'))
      })
    )


  // buscarLivros() {
  //   this.subscription = this.service.buscar(this.campoBusca).subscribe({
  //     next: (items) => {
  //       console.log('requisiçoes ao servidor')
  //       this.listaLivros = this.livrosResultadoParaLivros(items)
  //     },
  //     error: erro => console.error(erro),
  //   })
  // }

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map((item) => {
      return new LivroVolumeInfo(item);
    });
  }

  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }
}
