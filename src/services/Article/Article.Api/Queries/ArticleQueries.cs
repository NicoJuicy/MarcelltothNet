﻿using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using JetBrains.Annotations;

namespace MarcellTothNet.Services.Article.Api.Queries
{
    public class ArticleQueries : QueriesBase, IArticleQueries
    {
        public ArticleQueries(Func<DbConnection> sqlConnectionFactory) : base(sqlConnectionFactory)
        {
        }

        public async Task<IEnumerable<ArticleViewModel>> GetAllArticlesAsync()
        {
            using (var connection = await CreateAndOpenDbConnectionAsync())
            {
                // Load all the articles
                IList<ArticleViewModel> articleViewModels = (await connection.QueryAsync<ArticleViewModel>(
                    @"SELECT [Articles].[Id], [Articles].[Title], [Articles].[PublishTime] as PublishDate, [Articles].[Thumbnail_AltText] as ThumbnailAltText, [IsPublished]
                          FROM [Articles];")).AsList();

                // Load all the tag mappings
                IList<Article2TagModel> article2TagModels = (await connection.QueryAsync<Article2TagModel>("SELECT [ArticleId], [TagId] FROM [Article2Tag]")).AsList();

                // Push the list of tags into the articles.
                foreach (var articleViewModel in articleViewModels)
                {
                    articleViewModel.TagIds = article2TagModels.Where(at => at.ArticleId == articleViewModel.Id).Select(at => at.TagId).ToList();
                }

                return articleViewModels;
            }
        }

        public async Task<ArticleViewModel> GetArticleAsync(int articleId)
        {
            using (var connection = await CreateAndOpenDbConnectionAsync())
            {
                ArticleViewModel articleViewModel = await connection.QueryFirstOrDefaultAsync<ArticleViewModel>(
                    @"SELECT [Id], [Title], [PublishTime] as PublishDate, [Thumbnail_Location] as ThumbnailLocation, [Thumbnail_AltText] as ThumbnailAltText, [Content], [IsPublished]
                            FROM [Articles] WHERE [Id] = @id", new {id = articleId});
                articleViewModel.TagIds =
                    (await connection.QueryAsync<int>("SELECT [TagId] FROM [Article2Tag] WHERE [ArticleId] = @articleId", new {articleId})).ToList();
                return articleViewModel;
            }
        }


        [UsedImplicitly(ImplicitUseKindFlags.InstantiatedNoFixedConstructorSignature, ImplicitUseTargetFlags.WithMembers)]
        private class Article2TagModel
        {
            public int ArticleId { get; set; }

            public int TagId { get; set; }
        }
    }
}