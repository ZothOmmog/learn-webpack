import * as $ from 'jquery';

function createAnalytics(): object {
    let counter = 0;
    let destoyed:boolean = false;

    const listener = ():number => counter++;

    $(document).on('click', listener);

    return {
        destroy: () => {
            $(document).off('click', listener);
            destoyed = true;
        },
        getClicks: () => destoyed ? `Analytics is descroyed. Total clicks = ${counter}` : counter
    }
}

window['analytics'] = createAnalytics();