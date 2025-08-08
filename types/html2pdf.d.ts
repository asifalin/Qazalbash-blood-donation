declare module 'html2pdf.js' {
  interface Html2pdfOptions {
    margin?: number;
    filename?: string;
    image?: {
      type?: string;
      quality?: number;
    };
    html2canvas?: {
      scale?: number;
      logging?: boolean;
      dpi?: number;
      letterRendering?: boolean;
    };
    jsPDF?: {
      unit?: string;
      format?: string;
      orientation?: string;
    };
  }

  interface Html2pdf {
    (element: HTMLElement | string, opt?: Html2pdfOptions): Html2pdf;
    from(element: HTMLElement | string): Html2pdf;
    set(opt: Html2pdfOptions): Html2pdf;
    save(filename?: string): Promise<void>;
    // Add other methods if needed
  }

  const html2pdf: () => Html2pdf;
  export default html2pdf;
} 