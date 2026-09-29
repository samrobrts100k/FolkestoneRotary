-- Sample content. Everything is flagged is_sample = true: edit or delete in /admin once real details are confirmed.
insert into event_categories (slug, name, sort_order) values ('fundraising','Fundraising',1),('community','Community',2),('social','Social',3),('business','Business',4),('youth','Youth',5) on conflict do nothing;
insert into news_categories (slug, name, sort_order) values ('club-news','Club News',1),('fundraising','Fundraising',2),('community','Community',3) on conflict do nothing;

insert into events (slug,title,short_description,description,starts_at,ends_at,venue_name,category,status,show_countdown,is_sample,programme,faq) values
('folkestone-rotary-golf-day','Folkestone Rotary Golf Day','A friendly team golf day raising money for local causes, with lunch and prizes.','Sample description — replace with confirmed details.', now()+interval '35 days', now()+interval '35 days 8 hours','Local golf club (TBC)','fundraising','published',true,true,'[{"time":"08:00","item":"Registration"},{"time":"09:00","item":"Tee off"}]','[{"q":"Where does the money go?","a":"All proceeds support local Folkestone causes."}]'),
('folkestone-half-marathon','Folkestone Half Marathon','Run the Leas and the coast in Folkestone''s flagship community race.','Sample description — replace with confirmed details.', now()+interval '80 days', now()+interval '80 days 5 hours','Folkestone Seafront','community','published',true,true,'[]','[]'),
('christmas-collections','Christmas Collections','Join Santa''s sleigh and help collect for families in need this Christmas.','Sample description — replace with confirmed details.', now()+interval '60 days', now()+interval '60 days 3 hours','Around Folkestone','community','published',false,true,'[]','[]'),
('race-night','Race Night','An evening of fun, friendly betting and supper — all for charity.','Sample description — replace with confirmed details.', now()+interval '20 days', now()+interval '20 days 3 hours','Venue to be confirmed','social','published',false,true,'[]','[]'),
('wine-and-wisdom','Wine & Wisdom','A relaxed quiz-and-tasting evening with great company.','Sample description — replace with confirmed details.', now()+interval '45 days', now()+interval '45 days 3 hours','Venue to be confirmed','social','published',false,true,'[]','[]'),
('dragons-den','Dragons'' Den','Young entrepreneurs pitch business ideas to a panel of local business leaders.','Sample description — replace with confirmed details.', now()+interval '100 days', now()+interval '100 days 3 hours','Local school (TBC)','youth','published',false,true,'[]','[]');

insert into news (slug,title,summary,body,author,category,tags,published_at,status,featured,is_sample) values
('community-funding-round-open','Community funding round now open','Local charities and groups can now apply for grants.','Sample article — replace with real news.','Folkestone Rotary','community','{funding,charity}', now()-interval '5 days','published',true,true),
('baby-basics-folkestone-donation','Supporting Baby Basics Folkestone','Rotary funds essentials for local new parents.','Sample article — replace with real news.','Folkestone Rotary','community','{families,funding}', now()-interval '15 days','published',false,true),
('welcome-new-members','Welcoming new members to the club','A warm welcome to our newest Rotarians.','Sample article — replace with real news.','Folkestone Rotary','club-news','{membership}', now()-interval '30 days','published',false,true);

insert into impact_stories (slug,title,organisation,summary,outcome,amount_awarded,status,is_sample) values
('baby-basics-folkestone','Baby Basics Folkestone','Baby Basics Folkestone','Essential items for local families welcoming a new baby.','Families received starter packs when they needed them most.',1500,'published',true),
('local-schools','Supporting local schools','Folkestone primary schools','Books, equipment and enterprise activities.','More children able to take part in learning.',2000,'published',true),
('community-charities','Community charity grants','Local charities','Grants to small charities delivering vital services.','Local groups kept essential services running.',5000,'published',true),
('christmas-family-support','Christmas family support','Local families','Gifts and food for families facing hardship.','Families enjoyed a happier Christmas.',null,'published',true),
('youth-programmes','Youth programmes','Young people of Folkestone','Enterprise, sport and skills opportunities.','Young people gained confidence and skills.',1000,'published',true);

insert into stats (label,value,prefix,suffix,sort_order,is_sample) values
('Raised for local causes',48500,'£','+',1,true),('Local organisations supported',40,'','+',2,true),('Volunteer hours contributed',1200,'','+',3,true),
('Families supported at Christmas',120,'','',4,true),('Young people supported',300,'','+',5,true);

insert into sponsors (name,website,level,status,is_sample,description) values
('Sample Gold Sponsor','https://example.org','gold','published',true,'Sample sponsor — replace.'),
('Sample Silver Sponsor','https://example.org','silver','published',true,'Sample sponsor — replace.'),
('Sample Bronze Sponsor','https://example.org','bronze','published',true,'Sample sponsor — replace.'),
('Sample Community Partner','https://example.org','community','published',true,'Sample sponsor — replace.');

insert into content_items (kind,title,body,page,sort_order,status,is_sample) values
('faq','Do I need to be a business owner to join?','No. Rotary welcomes people from every background.','join',1,'published',true),
('faq','How much time does it take?','As much or as little as you can give.','join',2,'published',true),
('faq','Can I visit before joining?','Yes — come along as a guest, no commitment.','join',3,'published',true),
('faq','Who can apply for funding?','Registered charities, community groups, schools and non-profits in the Folkestone area.','funding',1,'published',true),
('testimonial','Sample Member, Rotarian','“Rotary is a great way to meet people and make a real difference locally.” (sample)',null,1,'published',true),
('testimonial','Sample Charity Trustee','“The grant transformed what we could offer.” (sample)',null,2,'published',true),
('annual_report','Annual Report (sample)','Upload the PDF and paste its link into the URL field.',null,1,'published',true),
('timeline','Founded','Add the founding year and key milestones (sample).',null,1,'published',true),
('leader','Club President','Name to be confirmed (sample).',null,1,'published',true),
('leader','Secretary','Name to be confirmed (sample).',null,2,'published',true),
('leader','Treasurer','Name to be confirmed (sample).',null,3,'published',true);
