/*
 * Renders page content from data/portfolio.json.
 *
 * Edit data/portfolio.json to change the site's content -- not this file and
 * not index.html. Each render function below fills one section by its id.
 *
 * This runs BEFORE main.js so the animation plugins (waypoints, scrollax)
 * see the finished markup when they initialise.
 */
(function () {
  "use strict";

  // Escape text so a stray < or & in the data file can't break the markup.
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function set(id, html) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  // The hero is a single, image-free panel. The role line under the name is
  // typed out and deleted one character at a time by typeRoles() below.
  function renderHero(d) {
    if (!d) return;
    var pb = d.primaryButton || {};
    var sb = d.secondaryButton || {};
    var roles = d.roles || [];

    set(
      "hero-inner",
      '<div class="container">' +
      '<div class="hero-text text-center">' +
      '<span class="subheading">' + esc(d.subheading) + "</span>" +
      // heading may contain an intentional <span> highlight, so it is not escaped
      '<h1 class="mb-4 mt-3">' + (d.heading || "") + "</h1>" +
      (roles.length
        ? '<h2 class="hero-role mb-4">' +
          // pre-wrap keeps the trailing space in "I'm a " from collapsing
          '<span class="hero-role-prefix">' + esc(d.rolePrefix) + "</span>" +
          '<span class="hero-role-text"></span>' +
          '<span class="hero-caret">|</span></h2>'
        : "") +
      '<p class="hero-actions mb-0">' +
      '<a href="' + esc(pb.href) + '" class="btn btn-primary py-3 px-4">' + esc(pb.label) + "</a> " +
      '<a href="' + esc(sb.href) + '" class="btn btn-white btn-outline-white py-3 px-4">' + esc(sb.label) + "</a></p>" +
      "</div></div>"
    );

    if (roles.length) typeRoles(roles);
  }

  // Types a role in, holds it, deletes it, then moves on to the next one.
  function typeRoles(roles) {
    var out = document.querySelector(".hero-role-text");
    if (!out) return;

    var TYPE_MS = 90;    // per character while typing
    var DELETE_MS = 45;  // per character while deleting -- erasing reads faster
    var HOLD_MS = 1600;  // pause on the complete word
    var BLANK_MS = 400;  // pause before the next word starts

    var i = 0;   // which role
    var n = 0;   // how many characters of it are shown
    var deleting = false;

    (function step() {
      var role = roles[i];
      n = n + (deleting ? -1 : 1);
      out.textContent = role.slice(0, n);

      var wait = deleting ? DELETE_MS : TYPE_MS;
      if (!deleting && n === role.length) {
        deleting = true;
        wait = HOLD_MS;
      } else if (deleting && n === 0) {
        deleting = false;
        i = (i + 1) % roles.length;
        wait = BLANK_MS;
      }
      setTimeout(step, wait);
    })();
  }

  function renderAbout(d) {
    if (!d) return;
    var img = document.getElementById("about-image");
    if (img && d.image) img.style.backgroundImage = "url(" + d.image + ")";
    set("about-text", (d.paragraphs || []).map(function (p) {
      return "<p>" + esc(p) + "</p>";
    }).join(""));
    set("about-info", (d.info || []).map(function (i) {
      var v = i.href
        ? '<a href="' + esc(i.href) + '">' + esc(i.value) + "</a>"
        : esc(i.value);
      return '<li class="d-flex"><span>' + esc(i.label) + ":</span> <span>" + v + "</span></li>";
    }).join(""));
  }

  function renderEducation(list) {
    set("education-timeline", (list || []).map(function (e) {
      var badge = e.logo
        ? '<img src="' + esc(e.logo) + '" alt="' + esc(e.school) + '">'
        : "<span>" + esc(e.badge) + "</span>";

      var degree = "";
      if (e.degree || e.field) {
        degree =
          '<p class="edu-degree"><span>' + esc(e.degree) + "</span>" +
          (e.field ? " &middot; <span>" + esc(e.field) + "</span>" : "") +
          "</p>";
      }

      var points = (e.points || []).length
        ? '<ul class="edu-points">' +
          e.points.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") +
          "</ul>"
        : "";

      var pubs = "";
      if ((e.publications || []).length) {
        pubs =
          '<h4 class="edu-sub-heading">Publications</h4>' +
          e.publications.map(function (p) {
            var meta = esc(p.venue) + (p.year ? " &middot; " + esc(p.year) : "");
            var links = "";
            if (p.link) links += '<a href="' + esc(p.link) + '">View Paper &rarr;</a>';
            if (p.award) {
              links +=
                '<span class="edu-award">&#127942; ' + esc(p.award) + "</span>";
            }
            return (
              '<div class="edu-publication">' +
              "<h5>" + esc(p.title) + "</h5>" +
              '<p class="edu-pub-meta">' + meta + "</p>" +
              (links ? '<p class="edu-pub-links">' + links + "</p>" : "") +
              "</div>"
            );
          }).join("");
      }

      return (
        '<div class="edu-item ftco-animate">' +
        '<div class="edu-badge">' + badge + "</div>" +
        '<div class="edu-content">' +
        '<div class="edu-head">' +
        '<h3 class="edu-school">' + esc(e.school) + "</h3>" +
        '<span class="edu-date">' + esc(e.date) + "</span>" +
        "</div>" + degree + points + pubs +
        "</div></div>"
      );
    }).join(""));
  }

  function renderExperience(list) {
    set("experience-timeline", (list || []).map(function (x) {
      var badge = x.logo
        ? '<img src="' + esc(x.logo) + '" alt="' + esc(x.organization) + '">'
        : "<span>" + esc(x.badge) + "</span>";

      // Older entries carry a single description string instead of points.
      var points = (x.points || []).length
        ? x.points
        : (x.description ? [x.description] : []);

      var list_ = points.length
        ? '<ul class="exp-points">' +
          points.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") +
          "</ul>"
        : "";

      return (
        '<div class="exp-item ftco-animate">' +
        '<div class="exp-badge">' + badge + "</div>" +
        '<div class="exp-content">' +
        '<div class="exp-head">' +
        '<h3 class="exp-role">' + esc(x.role) + "</h3>" +
        '<span class="exp-date">' + esc(x.date) + "</span>" +
        "</div>" +
        '<p class="exp-org">' + esc(x.organization) + "</p>" +
        list_ +
        "</div></div>"
      );
    }).join(""));
  }

  // A card per project. Cards past initialCount are rendered but hidden, and the
  // "See More Projects" button reveals them -- so every project is in the page
  // source for search engines even while the section stays short.
  function renderProjects(d) {
    if (!d) return;
    set("projects-intro", d.intro ? "<p>" + esc(d.intro) + "</p>" : "");

    var items = d.items || [];
    if (!items.length) return;

    // "icon" takes either an icomoon class name ("icon-database") or the URL or
    // path of an image ("images/shot.png", "https://.../shot.jpg"). Anything
    // with a slash, a protocol or an image extension is treated as an image.
    function isImageRef(s) {
      return /^(https?:|data:|\/\/)/i.test(s) ||
             s.indexOf("/") > -1 ||
             /\.(png|jpe?g|gif|svg|webp|avif)(\?|#|$)/i.test(s);
    }

    // Card header. An image -- from "image", or from "icon" when it holds a URL
    // or path rather than an icomoon class -- fills the header edge to edge.
    // Only a bare icon class falls back to the gradient panel with a glyph.
    function media(p) {
      var src = p.image;
      if (!src && p.icon && isImageRef(p.icon)) src = p.icon;

      if (src) {
        return (
          '<div class="project-card-media">' +
          '<img src="' + esc(src) + '" alt="' + esc(p.title) + '" loading="lazy">' +
          statusBadge(p) +
          "</div>"
        );
      }

      return (
        '<div class="project-card-media project-card-media-blank">' +
        '<span class="' + esc(p.icon || "icon-code") + '"></span>' +
        statusBadge(p) +
        "</div>"
      );
    }

    function statusBadge(p) {
      var text = p.status || p.badge;
      if (!text) return "";
      var kind = p.status ? "is-ongoing" : "is-note";
      return '<span class="project-status ' + kind + '">' + esc(text) + "</span>";
    }

    // Descriptions are clamped to keep a row of cards even, which would
    // otherwise cut long ones off with no way to read the rest. Only the
    // descriptions that actually overflow get a "Read more" toggle, so short
    // ones stay clean. Measured after layout, and re-measured on resize
    // because a narrower card wraps to more lines.
    function setupDescToggles() {
      var wraps = document.querySelectorAll(".project-desc-wrap");

      function sync() {
        for (var i = 0; i < wraps.length; i++) {
          var wrap = wraps[i];
          var desc = wrap.querySelector(".project-card-desc");
          var btn = wrap.querySelector(".project-desc-toggle");
          if (!desc) continue;

          // An expanded card is always overflowing by definition, so only
          // measure while clamped.
          if (wrap.classList.contains("is-expanded")) continue;

          var overflows = desc.scrollHeight - desc.clientHeight > 2;
          if (overflows && !btn) {
            btn = document.createElement("button");
            btn.type = "button";
            btn.className = "project-desc-toggle";
            btn.setAttribute("aria-expanded", "false");
            btn.innerHTML = '<span class="project-desc-toggle-text">Read more</span>' +
              '<span class="icon-keyboard_arrow_down project-desc-toggle-caret"></span>';
            btn.addEventListener("click", toggle);
            wrap.appendChild(btn);
            wrap.classList.add("is-clamped");
          } else if (!overflows && btn) {
            btn.parentNode.removeChild(btn);
            wrap.classList.remove("is-clamped");
          }
        }
      }

      function toggle(e) {
        var btn = e.currentTarget;
        var wrap = btn.parentNode;
        var open = !wrap.classList.contains("is-expanded");
        wrap.classList.toggle("is-expanded", open);
        wrap.classList.toggle("is-clamped", !open);
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        btn.querySelector(".project-desc-toggle-text").textContent =
          open ? "Show less" : "Read more";
      }

      sync();

      var t;
      window.addEventListener("resize", function () {
        clearTimeout(t);
        t = setTimeout(sync, 150);
      });

      // Cards behind "See More Projects" are hidden and measure as zero-height,
      // so they need a second pass once they are actually laid out.
      return sync;
    }

    var cards = items.map(function (p, idx) {
      var hidden = idx >= (d.initialCount || items.length);

      var meta = [];
      if (p.category) {
        // "Personal Project" -> "is-personal", so each category gets its own
        // colour below. Anything unrecognised falls back to the base style.
        var slug = p.category.toLowerCase();
        var kind = slug.indexOf("personal") > -1 ? " is-personal"
          : slug.indexOf("academic") > -1 ? " is-academic"
          : slug.indexOf("industry") > -1 ? " is-industry"
          : "";
        meta.push('<span class="project-category' + kind + '">' + esc(p.category) + "</span>");
      }
      if (p.date) meta.push('<span class="project-date">' + esc(p.date) + "</span>");

      var tech = (p.tech || []).length
        ? '<div class="project-tech">' +
          '<h6 class="project-tech-label">Tech Stack:</h6>' +
          '<div class="project-tech-pills">' +
          p.tech.map(function (t) {
            return '<span class="project-pill">' + esc(t) + "</span>";
          }).join("") +
          "</div></div>"
        : "";

      var links = (p.links || []).length
        ? '<div class="project-links">' +
          p.links.map(function (l) {
            return (
              '<a href="' + esc(l.href) + '" target="_blank" rel="noopener">' +
              '<span class="' + esc(l.icon || "icon-external-link") + '"></span>' +
              esc(l.label) + "</a>"
            );
          }).join("") +
          "</div>"
        : "";

      return (
        '<div class="col-md-6 col-lg-4 d-flex project-col' +
        (hidden ? " project-col-extra" : "") + '"' +
        (hidden ? ' hidden aria-hidden="true"' : "") + ">" +
        '<article class="project-card">' +
        media(p) +
        '<div class="project-card-body">' +
        (meta.length ? '<div class="project-card-meta">' + meta.join("") + "</div>" : "") +
        '<h3 class="project-card-title">' + esc(p.title) + "</h3>" +
        (p.description
          ? '<div class="project-desc-wrap">' +
            '<p class="project-card-desc">' + esc(p.description) + "</p>" +
            "</div>"
          : "") +
        tech + links +
        "</div></article></div>"
      );
    });

    set("projects-list", cards.join(""));
    var syncDescToggles = setupDescToggles();

    var extras = document.querySelectorAll(".project-col-extra");
    var toggleWrap = document.getElementById("projects-toggle");
    if (!extras.length || !toggleWrap) return;

    var moreLabel = d.showMoreLabel || "See More Projects";
    var lessLabel = d.showLessLabel || "Show Less";
    var expanded = false;

    toggleWrap.innerHTML =
      '<button type="button" class="project-toggle" aria-expanded="false">' +
      '<span class="project-toggle-text">' + esc(moreLabel) + "</span>" +
      '<span class="icon-keyboard_arrow_down project-toggle-caret"></span></button>';

    var btn = toggleWrap.querySelector(".project-toggle");
    btn.addEventListener("click", function () {
      expanded = !expanded;
      for (var i = 0; i < extras.length; i++) {
        extras[i].hidden = !expanded;
        extras[i].setAttribute("aria-hidden", expanded ? "false" : "true");
      }
      btn.setAttribute("aria-expanded", expanded ? "true" : "false");
      btn.classList.toggle("is-expanded", expanded);
      btn.querySelector(".project-toggle-text").textContent =
        expanded ? lessLabel : moreLabel;

      // The newly revealed cards could not be measured while hidden.
      if (expanded) syncDescToggles();

      // Collapsing from far down the list would otherwise leave the viewport
      // below the section; bring the heading back into view.
      if (!expanded) {
        var section = document.getElementById("projects-section");
        if (section) window.scrollTo({ top: section.offsetTop - 70, behavior: "smooth" });
      }
    });
  }

  // Compact cards: one summary line plus tag pills, so a long post does not
  // stretch the section. The full article lives behind the "Read article" link.
  function renderBlog(list) {
    set("blog-list", (list || []).map(function (b) {
      var summary = b.summary || (b.excerpt || [])[0] || "";
      var tags = (b.tags || []).map(function (t) {
        return '<span class="blog-tag">' + esc(t) + "</span>";
      }).join("");

      return (
        '<div class="col-md-6 col-lg-4 d-flex ftco-animate">' +
        '<article class="blog-card">' +
        '<div class="blog-card-meta">' +
        '<span><span class="icon-calendar"></span>' + esc(b.date) + "</span>" +
        (b.readTime ? '<span><span class="icon-clock-o"></span>' + esc(b.readTime) + "</span>" : "") +
        "</div>" +
        '<h3 class="blog-card-title">' +
        '<a href="' + esc(b.link) + '" target="_blank" rel="noopener">' + esc(b.title) + "</a></h3>" +
        (summary ? '<p class="blog-card-summary">' + esc(summary) + "</p>" : "") +
        (tags ? '<div class="blog-card-tags">' + tags + "</div>" : "") +
        '<a class="blog-card-link" href="' + esc(b.link) + '" target="_blank" rel="noopener">' +
        '<span class="icon-external-link"></span>Read article</a>' +
        "</article></div>"
      );
    }).join(""));
  }

  // Social icon list, shared by the Get In Touch card and the footer bar.
  function socialItems(list) {
    return (list || []).map(function (s) {
      var label = esc(s.label || "");
      return (
        '<li><a href="' + esc(s.href) + '" target="_blank" rel="noopener"' +
        (label ? ' aria-label="' + label + '" title="' + label + '"' : "") +
        '><span class="' + esc(s.icon) + '"></span></a></li>'
      );
    }).join("");
  }

  function renderGetInTouch(d) {
    if (!d) return;
    var title = document.querySelector(".get-in-touch-title");
    if (title && d.title) title.textContent = d.title;
    set("touch-blurb", esc(d.blurb));
    var cta = document.getElementById("touch-cta");
    if (cta) {
      cta.textContent = d.ctaLabel || "";
      cta.href = d.ctaHref || "#";
      // A resume link should download rather than open in the browser;
      // ctaDownload sets the filename the visitor gets.
      if (d.ctaHref) cta.setAttribute("download", d.ctaDownload || "");
    }
    set("touch-social", socialItems(d.social));
  }

  function renderFooter(d) {
    if (!d) return;
    set("footer-copyright", esc(d.copyright));
  }

  function renderAll(data) {
    renderHero(data.hero);
    renderAbout(data.about);
    renderEducation(data.education);
    renderExperience(data.experience);
    renderProjects(data.projects);
    renderBlog(data.blog);
    renderGetInTouch(data.getInTouch);
    renderFooter(data.footer);
  }

  // Load the data, render, then load main.js so the plugins initialise last.
  function loadMain() {
    var s = document.createElement("script");
    s.src = "js/main.js";
    document.body.appendChild(s);
  }

  fetch("data/portfolio.json")
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(function (data) {
      try {
        renderAll(data);
      } catch (e) {
        console.error("[portfolio] Render failed:", e);
      }
      loadMain();
    })
    .catch(function (err) {
      console.error(
        "[portfolio] Could not load data/portfolio.json -- the page will be " +
        "missing its content. Serve the site over http:// (e.g. VS Code Live " +
        "Server), and check the file is valid JSON.",
        err
      );
      loadMain();
    });
})();
