import{_ as e,c as t,o as a,a3 as n}from"./chunks/framework.Bsyxd66g.js";const _=JSON.parse('{"title":"400 Authentication and Authorization","description":"","frontmatter":{},"headers":[],"relativePath":"adr/auth.md","filePath":"adr/auth.md"}'),o={name:"adr/auth.md"},r=n('<h1 id="_400-authentication-and-authorization" tabindex="-1">400 Authentication and Authorization <a class="header-anchor" href="#_400-authentication-and-authorization" aria-label="Permalink to &quot;400 Authentication and Authorization&quot;">​</a></h1><p>Our application will assume all users are already authenticated against and OIDC/Oauth2 identity provider. If they are not authenticated, they will be asked to authenticate.</p><p><strong>No unauthenticated access to the application will be allowed</strong>.</p><p>We believe that handling things like passwords and identity should be left to the pros. We will conform to the OIDC/Oauth2 protocols for this.</p><p>We will be <em>generally</em> following the guidance here: <a href="https://www.youtube.com/watch?v=hWJuX-8Ur2k" target="_blank" rel="noreferrer">(YouTube) Securing SPAs..BFF</a></p><h2 id="no-tokens-in-the-browser" tabindex="-1">No Tokens in the Browser <a class="header-anchor" href="#no-tokens-in-the-browser" aria-label="Permalink to &quot;No Tokens in the Browser&quot;">​</a></h2><p>Since we are doing a <a href="./bff.html">BFF</a>, we will not allow any tokens to be sent to the browser. We will use, on the client side, cookie authentication (with same site constraints).</p><h2 id="development-experience-frontend" tabindex="-1">Development Experience - Frontend <a class="header-anchor" href="#development-experience-frontend" aria-label="Permalink to &quot;Development Experience - Frontend&quot;">​</a></h2><p>For development, we will use a mock OIDC / Oauth2 server.</p><h2 id="development-experience-backend" tabindex="-1">Development Experience - Backend <a class="header-anchor" href="#development-experience-backend" aria-label="Permalink to &quot;Development Experience - Backend&quot;">​</a></h2><p>We will use tests where we stub the authentication.</p><p>We will use <a href="https://github.com/navikt/mock-oauth2-server" target="_blank" rel="noreferrer">Mock Oauth2 Server</a></p>',12),i=[r];function h(l,s,c,d,u,p){return a(),t("div",null,i)}const w=e(o,[["render",h]]);export{_ as __pageData,w as default};
