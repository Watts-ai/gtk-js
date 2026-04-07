use gtk::prelude::*;
use relm4::prelude::*;

pub struct ImageIconLarge;

#[relm4::component(pub)]
impl SimpleComponent for ImageIconLarge {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Image {
            set_icon_name: Some("open-menu-symbolic"),
            set_icon_size: gtk::IconSize::Large,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
