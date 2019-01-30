﻿using System.Collections.Generic;

namespace MarcellTothNet.Services.Article.Api.Models
{
    public class Tag
    {
        public int Id { get; set; }

        public string DisplayName { get; set; }

        public IList<ArticleTag> ArticleTags { get; set; }
    }
}