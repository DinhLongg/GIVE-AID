using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Backend.Swagger
{
    /// <summary>
    /// Builds a multipart/form-data request body schema for actions that accept [FromForm] parameters (e.g., IFormFile uploads).
    /// This prevents Swashbuckle from throwing when encountering IFormFile parameters and also documents
    /// the expected payload in Swagger UI.
    /// </summary>
    public sealed class FormFileRequestBodyOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var formParameters = context.ApiDescription.ParameterDescriptions
                .Where(p => p.Source == BindingSource.Form)
                .ToList();

            if (!formParameters.Any())
            {
                return;
            }

            operation.Parameters ??= new List<OpenApiParameter>();

            foreach (var formParam in formParameters)
            {
                var swaggerParam = operation.Parameters.FirstOrDefault(p => p.Name == formParam.Name);
                if (swaggerParam != null)
                {
                    operation.Parameters.Remove(swaggerParam);
                }
            }

            var schema = new OpenApiSchema
            {
                Type = "object",
                Properties = new Dictionary<string, OpenApiSchema>()
            };

            foreach (var formParam in formParameters)
            {
                var propertySchema = CreateSchemaFor(formParam, context);
                schema.Properties[formParam.Name] = propertySchema;

                if (formParam.IsRequired)
                {
                    schema.Required ??= new HashSet<string>();
                    schema.Required.Add(formParam.Name);
                }
            }

            operation.RequestBody = new OpenApiRequestBody
            {
                Required = schema.Required?.Any() == true,
                Content = new Dictionary<string, OpenApiMediaType>
                {
                    ["multipart/form-data"] = new OpenApiMediaType
                    {
                        Schema = schema
                    }
                }
            };
        }

        private static OpenApiSchema CreateSchemaFor(ApiParameterDescription parameter, OperationFilterContext context)
        {
            var parameterType = parameter.ModelMetadata?.ModelType ?? typeof(string);

            if (parameterType == typeof(IFormFile))
            {
                return new OpenApiSchema
                {
                    Type = "string",
                    Format = "binary"
                };
            }

            if (typeof(IEnumerable<IFormFile>).IsAssignableFrom(parameterType))
            {
                return new OpenApiSchema
                {
                    Type = "array",
                    Items = new OpenApiSchema
                    {
                        Type = "string",
                        Format = "binary"
                    }
                };
            }

            return context.SchemaGenerator.GenerateSchema(parameterType, context.SchemaRepository);
        }
    }
}

