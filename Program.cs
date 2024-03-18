using Database.Configuration;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;
using Database.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<DatabaseSetting>(builder.Configuration.GetSection("MongoDatabase"));

builder.Services.AddSingleton<QuestionService>();
builder.Services.AddSingleton<ParticipantService>();


builder.Services.AddControllers();
// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors(options =>
options.WithOrigins("http://localhost:3000")
.AllowAnyMethod()
.AllowAnyHeader());

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();





app.Run();


