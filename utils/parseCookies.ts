export const parseCookies = (cookie: string): Record<string,string> => {
  const list:Record<string, string> = {};

      cookie.split(`;`).forEach(function(cookie) {
        let [ name, ...rest] = cookie.split(`=`);
        name = name?.trim();
        if (!name) return;
        const value = rest.join(`=`).trim();
        if (!value) return;
        list[name] = decodeURIComponent(value);
      });

      return list;

}
