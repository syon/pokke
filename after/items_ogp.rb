require 'nokogiri'
require 'open-uri'
require 'open_uri_redirections'
require 'json'
require 'active_support/core_ext/object/blank'

class ScrapeUtil
  def initialize(url)
    html = open(url, :allow_redirections => :safe) do |f|
      @charset = f.charset
      f.read
    end
    @doc = Nokogiri::HTML.parse(html, @charset)
  end

  def get_title
    if @doc.css('//meta[property="og:site_name"]/@content').empty?
      return @doc.title.to_s
    else
      return @doc.css('//meta[property="og:site_name"]/@content').to_s
    end
  end

  def get_description
    if @doc.css('//meta[property="og:description"]/@content').empty?
      return @doc.css('//meta[name$="escription"]/@content').to_s
    else
      return @doc.css('//meta[property="og:description"]/@content').to_s
    end
  end

  def get_imagepath
    return @doc.css('//meta[property="og:image"]/@content').to_s
  end
end

def get_item10_id(item_id)
  id = item_id.rjust(10, '0') # leftpad
  id[0, 10]
end

exist_ids = []
Dir::glob("after/thumbs/**/*.jpg").each do |f|
  exist_ids << File.basename(f, ".jpg")
end

# url = 'http://www.perfume-web.jp'
data = open("after/items.json") do |io|
  JSON.load(io)
end

sites = []
data.each do |r|
  puts "\n#{r["item_id"]} - - - - - - - -"

  if exist_ids.include?(get_item10_id(r["item_id"]))
    puts "-- #{r["item_id"]} (ALREADY SCRAPED)"
    next
  else
    puts "-- #{r["item_id"]} (NEW SCRAPING)"
  end

  begin
    site = ScrapeUtil.new(r["item_url"])
    puts site.get_title
    puts "[org] " + r["image_url"]
    puts "[ogp] " + site.get_imagepath
    r["image_url"] = site.get_imagepath if site.get_imagepath.present?
    puts "[aft] #{r["image_url"]}"
  rescue
    puts "ERROR #{r["item_url"]}"
  end
end

data.each do |r|
  if exist_ids.include?(get_item10_id(r["item_id"]))
    puts "-- #{r["item_id"]} (ALREADY DOWNLOADED)"
    next
  else
    puts "-- #{r["item_id"]} (NEW DOWNLOAD)"
  end
  begin
    img_url = r["image_url"]
    next unless img_url
    m = img_url.match(%r{.(gif|jpg|png)(\?.*)?$}i)
    next unless m
    exp = m[1]
    unless exp
      puts "Not an image: #{img_url}"
      next
    end
    item_id = r["item_id"].rjust(10, '0') # leftpad
    dest_dir = item_id[0, 3]
    `mkdir -p after/thumbs/#{dest_dir}`
    `curl -o after/thumbs/#{dest_dir}/#{item_id}.#{exp} #{img_url}`
  rescue
    puts "ERROR!!"
    p r
  end
end
