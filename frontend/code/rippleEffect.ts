import { commitCss } from './utils';

export class RippleEffect {
    private element: HTMLElement;
    private rippleDuration: number;
    private rippleCssColor: string;

    private boundEventHandler: (event: MouseEvent) => void;

    constructor(
        element: HTMLElement,
        rippleDuration: number = 0.9,
        rippleCssColor: string = 'var(--rio-local-text-color)'
    ) {
        this.element = element;

        this.rippleDuration = rippleDuration;
        element.style.setProperty(
            '--rio-ripple-duration',
            `${this.rippleDuration}s`
        );

        this.rippleCssColor = rippleCssColor;
        element.style.setProperty('--rio-ripple-color', this.rippleCssColor);

        // Subscribe to events
        this.boundEventHandler = this.trigger.bind(this);
        this.element.addEventListener('click', this.boundEventHandler);
    }

    destroy() {
        this.element.removeEventListener('click', this.boundEventHandler);
    }

    trigger(event) {
        // Find the ripple's origin
        const rect = this.element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Spawn the ripple element
        let rippleElement = document.createElement('div');
        rippleElement.classList.add('rio-ripple-effect');
        this.element.appendChild(rippleElement);

        // Position it
        rippleElement.style.top = `${y}px`;
        rippleElement.style.left = `${x}px`;

        rippleElement.style.width = '0px';
        rippleElement.style.height = '0px';

        rippleElement.style.opacity = '0.1';

        // Commit CSS
        commitCss(rippleElement);

        // Animate it
        rippleElement.style.top = `${rect.height / 2}px`;
        rippleElement.style.left = `${rect.width / 2}px`;

        let size = Math.max(rect.width, rect.height) * 2;
        rippleElement.style.width = `${size}px`;
        rippleElement.style.height = `${size}px`;

        rippleElement.style.opacity = '0';

        // Remove the ripple element after the animation
        setTimeout(() => {
            rippleElement.remove();
        }, this.rippleDuration * 1000);
    }
}