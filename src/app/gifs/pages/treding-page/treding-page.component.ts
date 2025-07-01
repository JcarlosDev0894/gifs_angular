import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { GifService } from '../../services/gifs.service';
import { ScrollStateService } from 'src/app/shared/services/scroll-state.service';




@Component({
  selector: 'app-treding-page',
  templateUrl: './treding-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TredingPageComponent implements AfterViewInit {
  //gifs = signal(imageUrls);
  gifService = inject(GifService);
  scrollStateService = inject(ScrollStateService)

  scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('groupDiv');


  ngAfterViewInit(): void {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if(!scrollDiv)return;

    scrollDiv.scrollTop = this.scrollStateService.tredingScrollState();

  }


  onScroll($event: Event) {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if(!scrollDiv)return;

    const scrollTop = scrollDiv.scrollTop;
    const clientHeight = scrollDiv.clientHeight;
    const scrollHeinght = scrollDiv.scrollHeight;

    const isAtBotton = scrollTop + clientHeight + 300 >= scrollHeinght;
    this.scrollStateService.tredingScrollState.set(scrollTop);

    if(isAtBotton){
      this.gifService.loadTrtendingGifs();
      //console.log('scrolled to bottom');
    }

  }

 }
