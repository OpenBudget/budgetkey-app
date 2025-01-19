import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-speech-bubble',
    templateUrl: './speech-bubble.component.html',
    styleUrls: ['./speech-bubble.component.less'],
    standalone: false
})
export class SpeechBubbleComponent implements OnInit {

  @Input() kind: string;
  @Input() content: string;
  @Input() enter: boolean;

  constructor() { }

  ngOnInit() {
  }

}
