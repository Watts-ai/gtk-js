use relm4::prelude::*;

pub struct SearchBarDefault;

#[relm4::component(pub)]
impl SimpleComponent for SearchBarDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::SearchBar {
            set_search_mode: true,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
