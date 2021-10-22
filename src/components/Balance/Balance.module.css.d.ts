declare namespace BalanceModuleCssNamespace {
  export interface IBalanceModuleCss {
    balance: string;
    balanceLine: string;
    breakdown: string;
    connecting: string;
    hideBreakdown: string;
    showBreakdown: string;
  }
}

declare const BalanceModuleCssModule: BalanceModuleCssNamespace.IBalanceModuleCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: BalanceModuleCssNamespace.IBalanceModuleCss;
};

export = BalanceModuleCssModule;
