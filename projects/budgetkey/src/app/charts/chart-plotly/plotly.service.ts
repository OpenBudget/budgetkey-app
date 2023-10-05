import { Injectable } from "@angular/core";
import { PlatformService } from "../../common-components/platform.service";
import { ReplaySubject } from "rxjs";

import { Config, Data, Layout, Root } from "plotly.js";

@Injectable()
export class PlotlyService {

    ready = new ReplaySubject<void>(1);
    getting = false;

    constructor(private ps: PlatformService) {}

    newPlot(
        root: Root,
        data: Data[],
        layout?: Partial<Layout>,
        config?: Partial<Config>,
    ) {
        if (this.ps.server()) {
            return;
        }
        this.getPlotly();
        this.ready.subscribe(() => {
            const Plotly = (window as any).Plotly;
            Plotly.newPlot(root, data, layout, config);
        });
    }

    getPlotly() {
        if (this.getting) {
            return;
        }
        this.getting = true;
        console.log('getting plotly');
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://cdn.plot.ly/plotly-basic-2.26.1.min.js';
        script.onload = () => {
            this.ready.next();
            this.ready.complete();
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    }
}